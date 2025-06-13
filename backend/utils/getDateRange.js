import dayjs from 'dayjs';

export const getDateRange = (range, custom = {}) => {
  const today = dayjs();
  let start, end;

  switch (range) {
    /* ── Day-level ── */
    case 'today':
      start = today.startOf('day');
      end   = today.endOf('day');
      break;
    case 'yesterday':
      start = today.subtract(1, 'day').startOf('day');
      end   = today.subtract(1, 'day').endOf('day');
      break;

    /* ── Week-level ── */
    case 'thisWeek':
      start = today.startOf('week');  
      break;
    case 'lastWeek':
      start = today.subtract(1, 'week').startOf('week');
      end   = today.subtract(1, 'week').endOf('week');
      break;

    /* ── Rolling windows ── */
    case 'last7':
      start = today.subtract(6, 'day').startOf('day');
      end   = today.endOf('day');
      break;
    case 'last30':
      start = today.subtract(29, 'day').startOf('day');
      end   = today.endOf('day');
      break;
    case 'last90':
      start = today.subtract(89, 'day').startOf('day');
      end   = today.endOf('day');
      break;

    /* ── Month-level ── */
    case 'thisMonth':
      start = today.startOf('month');
      end   = today.endOf('month');
      break;
    case 'lastMonth':
      start = today.subtract(1, 'month').startOf('month');
      end   = today.subtract(1, 'month').endOf('month');
      break;

    /* ── Year-level ── */
    case 'thisYear':
      start = today.startOf('year');
      end   = today.endOf('year');
      break;
    case 'yearToDate':
      start = today.startOf('year');
      end   = today.endOf('day');      // up to now
      break;
    case 'lastYear':
      start = today.subtract(1, 'year').startOf('year');
      end   = today.subtract(1, 'year').endOf('year');
      break;

    /* ── Custom range ── */
    case 'custom':
      if (!custom.start || !custom.end) return {};         

      start = dayjs(custom.start);                         
      end   = dayjs(custom.end);
      break;

    /* ── No filter ── */
    case 'total':
    default:
      return {};                                          
  }

  return {
    $gte: start.toDate(),
    $lte: end.toDate(),
  };
};
