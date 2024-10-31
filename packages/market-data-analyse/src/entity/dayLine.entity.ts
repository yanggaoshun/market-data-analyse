import { IDayData } from 'tdx-api/lib/types/types/day';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'day_line', comment: '日线数据' })
export class DayLineEntity implements IDayData {
  @Column('date')
  date: Date;
  @Column('float')
  open: string;
  @Column('float')
  high: string;
  @Column('float')
  low: string;
  @Column('float')
  close: string;
  volume: number;
  amount: number;
  adjustFlag: number;
}
