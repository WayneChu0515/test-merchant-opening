import {MerchantOpeningWeekday, MerchantOpeningWeekdayList} from './dto';

export class Logic {
  private _collisionTime(
    {
      startList,
      startTime,
      endList,
      endTime,
    }: {
      startList: Array<string>;
      startTime: string;
      endList: Array<string>;
      endTime: string;
    },
    isNewElement = true,
  ) {
    if (startTime === endTime) {
      return [startList, endList];
    }
    for (let i = 0; i < startList.length; i++) {
      if (endTime === endList[i] && startTime === startList[i]) {
        isNewElement = false;
        continue;
      } else if (endTime >= endList[i] && startTime <= startList[i]) {
        isNewElement = false;
        startList.splice(i, 1);
        endList.splice(i, 1);

        [startList, endList] = this._collisionTime({
          startList,
          endList,
          startTime: startTime,
          endTime: endTime,
        });
      } else if (startTime >= startList[i] && startTime <= endList[i]) {
        isNewElement = false;
        if (endTime <= endList[i]) {
          continue;
        }

        startTime = startList[i];
        startList.splice(i, 1);
        endList.splice(i, 1);

        [startList, endList] = this._collisionTime({
          startList,
          endList,
          startTime,
          endTime,
        });
      } else if (endTime <= endList[i] && endTime >= startList[i]) {
        isNewElement = false;
        if (startTime >= startList[i]) {
          continue;
        }

        endTime = endList[i];
        startList.splice(i, 1);
        endList.splice(i, 1);

        [startList, endList] = this._collisionTime({
          startList,
          endList,
          startTime,
          endTime,
        });
      } else if (startTime < startList[i]) {
        continue;
      } else if (startTime > endList[i]) {
        continue;
      } else if (endTime > endList[i]) {
        continue;
      } else if (endTime < startList[i]) {
        continue;
      }
    }
    if (isNewElement) {
      startList.push(startTime);
      endList.push(endTime);
    }

    return [startList, endList];
  }

  private async _checkTimeRepeat(list: Array<any>, merchantId: string) {
    const weekObj = {};
    const StartTime = '00:00';
    const EndTime = '24:00';
    let weekday;

    for (let i = 0; i < list.length; i++) {
      weekday = MerchantOpeningWeekday[list[i].weekday];

      if (!weekObj[weekday]) {
        weekObj[weekday] = {
          startList: [],
          endList: [],
        };
      }
      if (list[i].startTime > list[i].endTime) {
        const changeDay =
          Number(weekday) === MerchantOpeningWeekdayList.length
            ? MerchantOpeningWeekday.MONDAY
            : Number(weekday) + 1;
        if (!weekObj[changeDay]) {
          weekObj[changeDay] = {
            startList: [],
            endList: [],
          };
        }

        [weekObj[weekday].startList, weekObj[weekday].endList] =
          this._collisionTime({
            startList: weekObj[weekday].startList,
            endList: weekObj[weekday].endList,
            startTime: list[i].startTime,
            endTime: EndTime,
          });

        [weekObj[changeDay].startList, weekObj[changeDay].endList] =
          this._collisionTime({
            startList: weekObj[changeDay].startList,
            endList: weekObj[changeDay].endList,
            startTime: StartTime,
            endTime: list[i].endTime,
          });
      } else {
        [weekObj[weekday].startList, weekObj[weekday].endList] =
          this._collisionTime({
            startList: weekObj[weekday].startList,
            endList: weekObj[weekday].endList,
            startTime: list[i].startTime,
            endTime: list[i].endTime,
          });
      }
    }

    const result = [];
    for (const [key, value] of Object.entries(weekObj)) {
      const v = value as {
        startList: Array<string>;
        endList: Array<string>;
      };
      for (let i = 0; i < v.startList.length; i++) {
        result.push({
          startTime: v.startList[i],
          endTime: v.endList[i],
          weekday: key,
        });
      }
    }

    return result;

    /**
     * "MONDAY": {
     *    startTime: ["10:00", "14:00"],
     *    endTime: ["12:00", "18:00"],
     * }
     * "TUESDAY": {}
     */
  }

  async update(req: any, data: any): Promise<any> {
    const mappingList = await this._checkTimeRepeat(
      data.merchantOpenings,
      'merchantId',
    );

    return mappingList;
  }
}
