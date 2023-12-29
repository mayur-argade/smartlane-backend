import * as bcrypt from 'bcrypt';

export class PasswordUtil {

    data: string
    hash: any

    constructor(data: string) {
        this.data = data;
    }

    public async getHashAsync(): Promise<string> {

        bcrypt.hash(this.data, 5, function (err, hash) {
            this.hash = hash
        });

        return this.hash
    }

    public async compareHashAsync(): Promise<any> {

        bcrypt.compare(this.data, this.hash, function (err, res) {
            if (res) {
                return true
            } else {
                return false
            }
        });
    }

    public getHash(): string {
        this.hash = bcrypt.hashSync(this.data, 10);
        return this.hash
    }

    public compareHash(passwordHash): boolean {

        if (bcrypt.compareSync(this.data, passwordHash)) {
            return true
        } else {
            return false
        }
    }

}

