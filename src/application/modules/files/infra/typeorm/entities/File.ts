import { IFile } from '@domain/entities/contracts/IFile';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

@Entity('files')
class File implements IFile {
  @PrimaryColumn()
  id: string;

  @Column()
  filename: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = v4();
    }
  }
}

export { File };
