import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'market', comment: '股票变化数据秒级' })
export class Market {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ comment: '0 SH 1 SZ' })
  market: number;

  @Column({ type: 'varchar', length: 20 })
  code: string;

  @Column({ type: 'bigint' })
  active1: number;

  @Column({ type: 'bigint' })
  active2: number;

  @Column({ type: 'float' })
  lastPrice: number;

  @Column({ type: 'float' })
  preClose: number;

  @Column({ type: 'float' })
  open: number;

  @Column({ type: 'float' })
  high: number;

  @Column({ type: 'float' })
  low: number;

  @Column({ type: 'bigint' })
  totalVol: number;

  @Column({ type: 'bigint' })
  volume: number;

  @Column({ type: 'bigint' })
  amount: number;

  @Column({ type: 'bigint' })
  sellVol: number;

  @Column({ type: 'bigint' })
  buyVol: number;

  @Column({ type: 'float' })
  bid1: number;

  @Column({ type: 'float' })
  ask1: number;

  @Column({ type: 'bigint' })
  bidVol1: number;

  @Column({ type: 'bigint' })
  askVol1: number;

  @Column({ type: 'float' })
  bid2: number;

  @Column({ type: 'float' })
  ask2: number;

  @Column({ type: 'bigint' })
  bidVol2: number;

  @Column({ type: 'bigint' })
  askVol2: number;

  @Column({ type: 'float' })
  bid3: number;

  @Column({ type: 'float' })
  ask3: number;

  @Column({ type: 'bigint' })
  bidVol3: number;

  @Column({ type: 'bigint' })
  askVol3: number;

  @Column({ type: 'float' })
  bid4: number;

  @Column({ type: 'float' })
  ask4: number;

  @Column({ type: 'bigint' })
  bidVol4: number;

  @Column({ type: 'bigint' })
  askVol4: number;

  @Column({ type: 'float' })
  bid5: number;
  @Column({ type: 'float' })
  ask5: number;

  @Column({ type: 'bigint' })
  bidVol5: number;

  @Column({ type: 'bigint' })
  askVol5: number;

  @Column({ type: 'bigint' })
  reversedBytes0: number;

  @Column({ type: 'bigint' })
  reversedBytes1: number;

  @Column({ type: 'bigint' })
  reversedBytes2: number;

  @Column({ type: 'bigint' })
  reversedBytes3: number;

  @Column({ type: 'bigint' })
  reversedBytes4: number;

  @Column({ type: 'bigint' })
  reversedBytes5: number;

  @Column({ type: 'bigint' })
  reversedBytes6: number;

  @Column({ type: 'bigint' })
  reversedBytes7: number;

  @Column({ type: 'bigint' })
  reversedBytes8: number;

  @Column({ type: 'bigint' })
  reversedBytes9: number;

  @CreateDateColumn({ type: 'timestamp' }) // 自动填充创建时间
  createdAt: Date;

  @Column({ type: 'varchar', length: 30 })
  serverTime: string;
}
