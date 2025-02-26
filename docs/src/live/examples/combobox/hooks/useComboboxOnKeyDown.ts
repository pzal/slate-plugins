import { useCallback } from 'react';
import { SPEditor } from '@udecode/slate-plugins';
import { KeyboardHandler } from '@udecode/slate-plugins-core';
import { IComboboxItem } from '../components/Combobox.types';
import { useComboboxIsOpen } from '../selectors/useComboboxIsOpen';
import { useComboboxStore } from '../useComboboxStore';
import { getNextWrappingIndex } from '../utils/getNextWrappingIndex';

/**
 * If the combobox is open, handle keyboard
 */
export const useComboboxOnKeyDown = ({
  onSelectItem,
}: {
  onSelectItem: (editor: SPEditor, item: IComboboxItem) => any;
}): KeyboardHandler => {
  const itemIndex = useComboboxStore((state) => state.itemIndex);
  const setItemIndex = useComboboxStore((state) => state.setItemIndex);
  const closeMenu = useComboboxStore((state) => state.closeMenu);
  const items = useComboboxStore((state) => state.items);
  const isOpen = useComboboxIsOpen();

  return useCallback(
    (editor) => (e) => {
      // if (!combobox) return false;

      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();

          const newIndex = getNextWrappingIndex(
            1,
            itemIndex,
            items.length,
            () => {},
            true
          );
          return setItemIndex(newIndex);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();

          const newIndex = getNextWrappingIndex(
            -1,
            itemIndex,
            items.length,
            () => {},
            true
          );
          return setItemIndex(newIndex);
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          return closeMenu();
        }

        if (['Tab', 'Enter'].includes(e.key)) {
          e.preventDefault();
          closeMenu();
          if (items[itemIndex]) {
            onSelectItem(editor, items[itemIndex]);
          }
          return false;
        }
      }
    },
    [isOpen, itemIndex, items, setItemIndex, closeMenu, onSelectItem]
  );
};
