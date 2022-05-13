export enum MerchantOpeningWeekday {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7,
}

export const MerchantOpeningWeekdayList = Object.keys(MerchantOpeningWeekday)
  .map(key =>
    typeof MerchantOpeningWeekday[key] === 'string'
      ? MerchantOpeningWeekday[key]
      : '',
  )
  .filter(Boolean);
