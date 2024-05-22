import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class ArkhamAddressInfo {
    @PrimaryGeneratedColumn(
        {
            type: 'int'
        }
    )
    id: number

    @Column()
    address: string

    @Column({
        default: null
    })
    chain: string

    @Column(
        {
            default: null
        }
    )
    entity: string

    @Column(
        {
            default: null
        }
    )
    entity_lable: string

    @Column(
        {
            default: null
        }
    )
    type: string

    @Column(
        {
            default: 0
        }
    )
    is_done: number

}