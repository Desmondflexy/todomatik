import react from 'react';

class Utils {
  usePrevious(value) {
    const ref = react.useRef();
    react.useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  properCase(text) {
    return text.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  }

  DATA = [];

  FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
  };

  FILTER_NAMES = Object.keys(this.FILTER_MAP);
}

/**Utility functions */
const utils = new Utils();
export default utils;