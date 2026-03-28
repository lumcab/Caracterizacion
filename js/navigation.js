export function createNavigator(sectionIds) {
  const state = {
    index: 0,
    total: sectionIds.length
  };

  function setIndex(nextIndex) {
    state.index = Math.max(0, Math.min(state.total - 1, nextIndex));
    return state.index;
  }

  function next() {
    return setIndex(state.index + 1);
  }

  function prev() {
    return setIndex(state.index - 1);
  }

  function isFirst() {
    return state.index === 0;
  }

  function isLast() {
    return state.index === state.total - 1;
  }

  return {
    state,
    setIndex,
    next,
    prev,
    isFirst,
    isLast
  };
}
