const getDateRange = (filter) => {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  switch (filter) {
    case "thisMonth":
      start.setDate(1);
      end.setMonth(now.getMonth() + 1, 0);
      break;
    case "lastMonth":
      start.setMonth(now.getMonth() - 1, 1);
      end.setMonth(now.getMonth(), 0);
      break;
    case "thisYear":
      start.setMonth(0, 1);
      end.setMonth(11, 31);
      break;
    case "lastYear":
      start.setFullYear(now.getFullYear() - 1, 0, 1);
      end.setFullYear(now.getFullYear() - 1, 11, 31);
      break;
    default:
      return null;
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return [start, end];
};

export default getDateRange;
