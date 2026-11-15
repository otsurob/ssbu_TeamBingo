import {
  Badge,
  Box,
  Button,
  CloseButton,
  Dialog,
  Portal,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import {
  createRoomPlayerSeparationPair,
  deleteRoomPlayerSeparationPair,
  fetchRoomPlayerSeparationPairs,
} from '../../../api/roomAPIs';
import { useAppToast } from '../../../hooks/useAppToast';
import type { ResponsePlayer, RoomPlayerSeparationPair } from '../../../types/restAPIResponse';

type DraftSeparationPair = Omit<RoomPlayerSeparationPair, 'id'> & {
  id?: number;
};

type PlayerSeparationSettingDialogProps = {
  room: string;
  players: ResponsePlayer[];
};

const clonePairs = (pairs: RoomPlayerSeparationPair[]): DraftSeparationPair[] =>
  pairs.map((pair) => ({ ...pair }));

const PlayerSeparationSettingDialog = ({ room, players }: PlayerSeparationSettingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [savedPairs, setSavedPairs] = useState<RoomPlayerSeparationPair[]>([]);
  const [draftPairs, setDraftPairs] = useState<DraftSeparationPair[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { showError, showSuccess } = useAppToast();

  const playerNames = useMemo(
    () => new Map(players.map((player) => [player.id, player.name])),
    [players],
  );

  const pairedPlayerIds = useMemo(
    () => new Set(draftPairs.flatMap((pair) => [pair.player_a_id, pair.player_b_id])),
    [draftPairs],
  );

  const getPlayerName = (playerId: number) =>
    playerNames.get(playerId) ?? `プレイヤーID: ${playerId}`;

  const loadPairs = async () => {
    setIsLoading(true);
    try {
      const pairs = await fetchRoomPlayerSeparationPairs(room);
      setSavedPairs(pairs);
      setDraftPairs(clonePairs(pairs));
      setSelectedPlayerIds([]);
    } catch {
      showError('別チーム設定の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      void loadPairs();
    } else {
      setSelectedPlayerIds([]);
    }
  };

  const togglePlayer = (playerId: number) => {
    if (pairedPlayerIds.has(playerId)) return;

    setSelectedPlayerIds((previous) => {
      if (previous.includes(playerId)) {
        return previous.filter((id) => id !== playerId);
      }
      if (previous.length >= 2) return previous;
      return [...previous, playerId];
    });
  };

  const addDraftPair = () => {
    if (selectedPlayerIds.length !== 2) return;
    const [playerAId, playerBId] = [...selectedPlayerIds].sort((a, b) => a - b);
    setDraftPairs((previous) => [
      ...previous,
      {
        player_a_id: playerAId,
        player_b_id: playerBId,
      },
    ]);
    setSelectedPlayerIds([]);
  };

  const removeDraftPair = (pairIndex: number) => {
    setDraftPairs((previous) => previous.filter((_, index) => index !== pairIndex));
  };

  const handleCancel = () => {
    setDraftPairs(clonePairs(savedPairs));
    setSelectedPlayerIds([]);
    setOpen(false);
  };

  const handleApply = async () => {
    const retainedPairIds = new Set(
      draftPairs.flatMap((pair) => (pair.id === undefined ? [] : [pair.id])),
    );
    const deletedPairs = savedPairs.filter((pair) => !retainedPairIds.has(pair.id));
    const addedPairs = draftPairs.filter((pair) => pair.id === undefined);

    setIsApplying(true);
    try {
      await Promise.all(deletedPairs.map((pair) => deleteRoomPlayerSeparationPair(room, pair.id)));
      for (const pair of addedPairs) {
        await createRoomPlayerSeparationPair(room, pair.player_a_id, pair.player_b_id);
      }

      const latestPairs = await fetchRoomPlayerSeparationPairs(room);
      setSavedPairs(latestPairs);
      setDraftPairs(clonePairs(latestPairs));
      setSelectedPlayerIds([]);
      setOpen(false);
      showSuccess('別チーム設定を反映しました');
    } catch {
      showError('別チーム設定の反映に失敗しました');
      await loadPairs();
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => handleOpenChange(details.open)}
      placement="center"
      motionPreset="slide-in-bottom"
      modal={true}
    >
      <Dialog.Trigger asChild>
        <Button variant="outline">別チーム設定</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="min(95vw, 620px)">
            <Dialog.Header>
              <Dialog.Title>別チームにするプレイヤー設定</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {isLoading ? (
                <Box display="flex" justifyContent="center" py={8}>
                  <Spinner />
                </Box>
              ) : (
                <Stack gap={5}>
                  <Stack gap={2}>
                    <Text fontSize="sm" color="fg.muted">
                      別々のチームにしたいプレイヤーを2人選択してください。
                    </Text>
                    <Stack direction="row" gap={2} flexWrap="wrap">
                      <Badge colorPalette="blue">選択中: {selectedPlayerIds.length} / 2</Badge>
                      {selectedPlayerIds.map((playerId) => (
                        <Badge key={playerId} variant="outline" maxW="180px">
                          <Text
                            as="span"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            title={getPlayerName(playerId)}
                          >
                            {getPlayerName(playerId)}
                          </Text>
                        </Badge>
                      ))}
                    </Stack>
                  </Stack>

                  <SimpleGrid columns={{ base: 2, sm: 3 }} gap={2}>
                    {players.map((player) => {
                      const isPaired = pairedPlayerIds.has(player.id);
                      const isSelected = selectedPlayerIds.includes(player.id);
                      const reachedSelectionLimit = selectedPlayerIds.length === 2 && !isSelected;

                      return (
                        <Button
                          key={player.id}
                          type="button"
                          variant={isSelected ? 'solid' : 'outline'}
                          colorPalette={isSelected ? 'blue' : 'gray'}
                          disabled={isPaired || reachedSelectionLimit}
                          onClick={() => togglePlayer(player.id)}
                          overflow="hidden"
                        >
                          <Text
                            as="span"
                            maxW="100%"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            title={player.name}
                          >
                            {player.name}
                          </Text>
                        </Button>
                      );
                    })}
                  </SimpleGrid>

                  {players.length < 2 && (
                    <Text fontSize="sm" color="fg.muted">
                      設定するにはプレイヤーが2人以上必要です。
                    </Text>
                  )}

                  <Button
                    variant="outline"
                    onClick={addDraftPair}
                    disabled={selectedPlayerIds.length !== 2}
                  >
                    選択した2人を追加
                  </Button>

                  <Stack gap={2}>
                    <Text fontWeight="bold">設定するペア</Text>
                    {draftPairs.length === 0 ? (
                      <Text fontSize="sm" color="fg.muted">
                        設定されているペアはありません。
                      </Text>
                    ) : (
                      draftPairs.map((pair, index) => (
                        <Stack
                          key={pair.id ?? `${pair.player_a_id}-${pair.player_b_id}`}
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          borderWidth="1px"
                          borderRadius="md"
                          px={3}
                          py={2}
                        >
                          <Stack direction="row" alignItems="center" flex={1} minW={0} gap={1}>
                            <Text
                              minW={0}
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                              title={getPlayerName(pair.player_a_id)}
                            >
                              {getPlayerName(pair.player_a_id)}
                            </Text>
                            <Text flexShrink={0}>/</Text>
                            <Text
                              minW={0}
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                              title={getPlayerName(pair.player_b_id)}
                            >
                              {getPlayerName(pair.player_b_id)}
                            </Text>
                          </Stack>
                          <Button
                            size="xs"
                            variant="ghost"
                            colorPalette="red"
                            onClick={() => removeDraftPair(index)}
                          >
                            解除
                          </Button>
                        </Stack>
                      ))
                    )}
                  </Stack>
                </Stack>
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={handleCancel} disabled={isApplying}>
                キャンセル
              </Button>
              <Button
                colorPalette="blue"
                onClick={handleApply}
                loading={isApplying}
                disabled={isLoading}
              >
                反映
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="md" disabled={isApplying} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default PlayerSeparationSettingDialog;
