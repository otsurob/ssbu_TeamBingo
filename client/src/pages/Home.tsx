import {
  Container,
  Center,
  Card,
  CardBody,
  Input,
  Button,
  Field,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toaster } from "../components/ui/toaster";

const Home = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const showToast = (title: string) => {
    toaster.create({
      title: title,
      type: "error",
      closable: true,
      // placement: "top",
    });
  };

  const resister = async () => {
    if (name == "") {
      showToast("名前を入力してください");
      return;
    }
    if (name.length > 20) {
      showToast("名前が長すぎます！");
      return;
    }
    navigate(`lobby?name=${name}`);
  };

  return (
    <Container pt={20} centerContent minH="100vh">
      <Card.Root>
        <CardBody>
          <Field.Root>
            <Field.Label>名前</Field.Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field.Root>
          <Center mt={8}>
            <Button
              marginRight={70}
              colorScheme="teal"
              size="lg"
              onClick={resister}
            >
              参加
            </Button>
          </Center>
        </CardBody>
      </Card.Root>
    </Container>
  );
};

export default Home;
