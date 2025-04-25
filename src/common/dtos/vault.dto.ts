import { IsEmpty, isNotEmpty, IsNotEmpty, IsString } from "class-validator";

export class VaultDto {
    @IsNotEmpty({ message: "name is required" })
    name: string
    encryptionKey: string
}

export class VaultItemDto {
    @IsNotEmpty({ message: "type is required" })
    type: 'note' | 'password' | 'file' | 'to-do'

    @IsNotEmpty({ message: "vaultId is required" })
    vaultId: string

    data: string
}

export class VaultCollabDto {
    permission: 'read' | 'write'
    @IsNotEmpty({ message: 'encrypted key is required' })
    encryptedKey: string
    @IsNotEmpty({ message: "vaultId is required" })
    vaultId: string;

    @IsNotEmpty({ message: "userid is required" })
    userId: string
}