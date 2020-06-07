export const SET_TAB_INDEX = "SET_TAB_INDEX";
export const setTabIndex = (tabIndex) => ({
  type: SET_TAB_INDEX,
  payload: { tabIndex },
});

export const SHOW_TOASTS = "SHOW_TOASTS";
export const showToasts = (toasts) => ({
  type: SHOW_TOASTS,
  payload: { toasts },
});

export const REMOVE_TOAST = "REMOVE_TOAST";
export const removeToast = (id) => ({
  type: REMOVE_TOAST,
  payload: { id },
});
