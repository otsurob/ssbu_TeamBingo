import {
  Badge,
  Box,
  Button,
  CloseButton,
  Dialog,
  Image,
  Portal,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { CHARACTER_MAX } from '../../../constants/constants';
import { fetchRoomCharacterSettings, updateRoomCharacterSetting } from '../../../api/roomAPIs';
import type { RoomCharacterSetting } from '../../../types/restAPIResponse';
import { useAppToast } from '../../../hooks/useAppToast';

type Team = 0 | 1;
type CharacterStatus = 'normal' | 'include' | 'exclude';
const MAX_INCLUDED_CHARACTERS = 25;

type TeamCharacterSetting = {
  include: number[];
  exclude: number[];
};

const initialSettings: Record<Team, TeamCharacterSetting> = {
  0: { include: [], exclude: [] },
  1: { include: [], exclude: [] },
};

const cloneSettings = (
  source: Record<Team, TeamCharacterSetting>,
): Record<Team, TeamCharacterSetting> => ({
  0: { include: [...source[0].include], exclude: [...source[0].exclude] },
  1: { include: [...source[1].include], exclude: [...source[1].exclude] },
});

const toTeamSettings = (response: RoomCharacterSetting[]): Record<Team, TeamCharacterSetting> => {
  const nextSettings = cloneSettings(initialSettings);
  response.forEach((setting) => {
    if (setting.team !== 0 && setting.team !== 1) return;
    nextSettings[setting.team] = {
      include: [...setting.include],
      exclude: [...setting.exclude],
    };
  });
  return nextSettings;
};

const getCharacterStatus = (character: number, setting: TeamCharacterSetting): CharacterStatus => {
  if (setting.include.includes(character)) return 'include';
  if (setting.exclude.includes(character)) return 'exclude';
  return 'normal';
};

const getNextStatus = (status: CharacterStatus): CharacterStatus => {
  if (status === 'normal') return 'include';
  if (status === 'include') return 'exclude';
  return 'normal';
};

type CharacterSettingDialogProps = {
  room: string;
};

const CharacterSettingDialog = ({ room }: CharacterSettingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team>(0);
  const [settings, setSettings] = useState<Record<Team, TeamCharacterSetting>>(initialSettings);
  const [draftSettings, setDraftSettings] =
    useState<Record<Team, TeamCharacterSetting>>(initialSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const { showError, showSuccess } = useAppToast();

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const response = await fetchRoomCharacterSettings(room);
        if (cancelled) return;
        const nextSettings = toTeamSettings(response);
        setSettings(nextSettings);
        setDraftSettings(cloneSettings(nextSettings));
      } catch {
        if (!cancelled) {
          showError('キャラクター設定の取得に失敗しました');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadSettings();
    return () => {
      cancelled = true;
    };
  }, [room, showError]);

  const currentSetting = draftSettings[selectedTeam];

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftSettings(cloneSettings(settings));
    }
    setOpen(nextOpen);
  };

  const toggleCharacter = (character: number) => {
    setDraftSettings((previous) => {
      const setting = previous[selectedTeam];
      const currentStatus = getCharacterStatus(character, setting);
      const nextStatus = getNextStatus(currentStatus);

      const include = setting.include.filter((item) => item !== character);
      const exclude = setting.exclude.filter((item) => item !== character);

      if (nextStatus === 'include') include.push(character);
      if (nextStatus === 'exclude') exclude.push(character);

      return {
        ...previous,
        [selectedTeam]: { include, exclude },
      };
    });
  };

  const clearCurrentTeam = () => {
    setDraftSettings((previous) => ({
      ...previous,
      [selectedTeam]: { include: [], exclude: [] },
    }));
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleApply = () => {
    const nextSettings = cloneSettings(draftSettings);
    if (
      nextSettings[0].include.length > MAX_INCLUDED_CHARACTERS ||
      nextSettings[1].include.length > MAX_INCLUDED_CHARACTERS
    ) {
      showError('includeできるキャラクターは25体までです');
      return;
    }

    const requests: RoomCharacterSetting[] = ([0, 1] as Team[]).map((team) => ({
      team,
      include: nextSettings[team].include,
      exclude: nextSettings[team].exclude,
    }));

    setIsApplying(true);
    Promise.all(requests.map((setting) => updateRoomCharacterSetting(room, setting)))
      .then(() => {
        setSettings(nextSettings);
        setOpen(false);
        showSuccess('キャラクター設定を反映しました');
      })
      .catch(() => {
        showError('キャラクター設定の反映に失敗しました');
      })
      .finally(() => setIsApplying(false));
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
        <Button variant="outline" disabled={isLoading || isApplying}>
          キャラクター設定
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="min(95vw, 760px)">
            <Dialog.Header>
              <Dialog.Title>キャラクター設定</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap={4}>
                <Text fontSize="sm" color="fg.muted">
                  キャラクターをクリックするたびに「通常 → include → exclude →
                  通常」と切り替わります。
                </Text>

                <Stack direction="row" gap={2}>
                  <Button
                    flex={1}
                    colorPalette="red"
                    variant={selectedTeam === 0 ? 'solid' : 'outline'}
                    onClick={() => setSelectedTeam(0)}
                  >
                    Team A
                  </Button>
                  <Button
                    flex={1}
                    colorPalette="blue"
                    variant={selectedTeam === 1 ? 'solid' : 'outline'}
                    onClick={() => setSelectedTeam(1)}
                  >
                    Team B
                  </Button>
                </Stack>

                <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
                  <Badge colorPalette="green">include: {currentSetting.include.length}</Badge>
                  <Badge colorPalette="red">exclude: {currentSetting.exclude.length}</Badge>
                  <Button size="xs" variant="ghost" onClick={clearCurrentTeam}>
                    Team {selectedTeam === 0 ? 'A' : 'B'}をリセット
                  </Button>
                </Stack>

                <SimpleGrid
                  columns={{ base: 5, sm: 7, md: 9 }}
                  gap={2}
                  maxH="55vh"
                  overflowY="auto"
                >
                  {Array.from({ length: CHARACTER_MAX }, (_, character) => {
                    const status = getCharacterStatus(character, currentSetting);
                    const statusLabel =
                      status === 'include' ? 'include' : status === 'exclude' ? 'exclude' : '通常';

                    return (
                      <Button
                        key={character}
                        type="button"
                        variant="outline"
                        h="auto"
                        minH="74px"
                        p={1}
                        position="relative"
                        borderWidth="2px"
                        borderColor={
                          status === 'include'
                            ? 'green.400'
                            : status === 'exclude'
                              ? 'red.400'
                              : 'transparent'
                        }
                        backgroundColor={status === 'exclude' ? 'red.50' : 'gray.50'}
                        opacity={status === 'exclude' ? 0.55 : 1}
                        onClick={() => toggleCharacter(character)}
                        aria-label={`キャラクター${character}を${statusLabel}に設定`}
                      >
                        <Image
                          src={`/character_image/character_${character}.png`}
                          alt={`キャラクター${character}`}
                          w="100%"
                          maxH="58px"
                          objectFit="contain"
                        />
                        {status !== 'normal' && (
                          <Box
                            position="absolute"
                            right={1}
                            bottom={1}
                            px={1}
                            borderRadius="sm"
                            backgroundColor={status === 'include' ? 'green.500' : 'red.500'}
                            color="white"
                            fontSize="2xs"
                            lineHeight="short"
                          >
                            {status === 'include' ? '必須' : '除外'}
                          </Box>
                        )}
                      </Button>
                    );
                  })}
                </SimpleGrid>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={handleCancel} disabled={isApplying}>
                キャンセル
              </Button>
              <Button colorPalette="blue" onClick={handleApply} loading={isApplying}>
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

export default CharacterSettingDialog;
