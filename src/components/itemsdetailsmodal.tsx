// components/ModalItem.tsx
import { Character } from '@/modal/character';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Text } from '@chakra-ui/react';
import Image from 'next/image';

interface ModalItemProps {
  character: Character
  onClose: () => void
}

// ModalItem component to show details of a clicked item
const ModalItem = ({ character, onClose }: ModalItemProps) => {
  return (
    <Modal isOpen={!!character} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{character.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        <Image width={200} height={200} src={character.image} alt={character.name} priority />
          <Text>{character.name}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalItem;
