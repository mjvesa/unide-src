import { checkModel } from "./check-model";

// Positions for DnD
export const POSITION_BEFORE_ELEMENT = -1;
export const POSITION_CHILD_OF_ELEMENT = 0;
export const POSITION_AFTER_ELEMENT = 1;

// Finds the first parenthesis starting from index which is not matched.
// That paren marks the end of the component
export const findDanglingParen = (arr, index) => {
  let i = index;
  let parenCount = 0;
  do {
    if (i >= arr.length) {
      throw "Ran out of array while dangling" + JSON.stringify(arr);
    }
    switch (arr[i].trim()) {
      case "(":
        parenCount++;
        break;
      case ")":
        parenCount--;
        break;
      default:
        break;
    }
    i++;
  } while (parenCount >= 0);
  return i - 1;
};

export const insertSubtree = (index, position, subtree, tree) => {
  let spliceIndex;
  switch (position) {
    case POSITION_CHILD_OF_ELEMENT:
      spliceIndex = findDanglingParen(tree, index + 1);
      break;
    case POSITION_BEFORE_ELEMENT:
      spliceIndex = index - 1;
      break;
    case POSITION_AFTER_ELEMENT:
      spliceIndex = findDanglingParen(tree, index + 1) + 1;
      break;
  }

  const left = tree.slice(0, spliceIndex);
  const right = tree.slice(spliceIndex);
  return left.concat(subtree).concat(right);
};

export const moveSubtree = (index, position, begin, end, tree) => {
  const subtree = tree.slice(begin, end + 1);
  checkModel(subtree);

  const newTree = insertSubtree(index, position, subtree, tree);

  if (index < begin) {
    // Adjust for content added before old position
    const subtreeLength = end - begin + 1;
    begin += subtreeLength;
    end += subtreeLength;
  }
  newTree.splice(begin, end - begin + 1);
  checkModel(newTree);
  return newTree;
};

export const deleteSubtree = (elementIndex, tree) => {
  const newTree = tree.slice();
  newTree.splice(
    elementIndex - 1,
    findDanglingParen(newTree, elementIndex + 1) - elementIndex + 2
  );
  return newTree;
};

export const updateSubtreeAttributes = (attributes, elementIndex, tree) => {
  // Find range of previous attributes
  let index = elementIndex + 1;
  do {
    const a = tree[index].trim();
    if (a === "(") {
      index--;
      break;
    }
    if (a === ")") {
      break;
    }
    index++;
  } while (index < tree.length);

  // Stick the attributes where the old ones were
  const first = tree.slice(0, elementIndex + 1);
  const rest = tree.slice(index, tree.length);
  return first.concat(attributes).concat(rest);
};
