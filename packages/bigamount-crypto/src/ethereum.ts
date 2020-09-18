import {BigAmount, Unit, Units, NumberAmount} from "@emeraldpay/bigamount";
import BigNumber from "bignumber.js";

export const WEIS = new Units(
    [
        new Unit(0, "Wei", "Wei"),
        new Unit(3, "Kwei", "KWei"),
        new Unit(6, "Mwei", "MWei"),
        new Unit(9, "Gwei", "GWei"),
        new Unit(12, "Microether", "μETH"),
        new Unit(15, "Milliether", "mETH"),
        new Unit(18, "Ether", "ETH"),
    ]
);

export const WEIS_ETC = new Units(
    [
        new Unit(0, "Wei", "Wei"),
        new Unit(3, "Kwei", "KWei"),
        new Unit(6, "Mwei", "MWei"),
        new Unit(9, "Gwei", "GWei"),
        new Unit(12, "Microether", "μETC"),
        new Unit(15, "Milliether", "mETC"),
        new Unit(18, "Ether", "ETC"),
    ]
);

export class WeiAny extends BigAmount {
    constructor(value: NumberAmount | BigAmount, units: Units) {
        super(value, units);
    }

    toHex(): string {
        return `${this.isNegative() ? '-' : ''}0x${this.number.abs().toString(16)}`;
    }

    toEther(): number {
        return this.number.dividedBy(this.units.top.multiplier).toNumber()
    }
}

export class Wei extends WeiAny {

    public static ZERO: Wei = new Wei(0);

    constructor(value: NumberAmount | BigAmount, unit?: string | Unit) {
        if (typeof unit !== "undefined") {
            if (BigAmount.is(value)) {
                throw new Error("Already BigAmount");
            }
            return BigAmount.createFor(value, WEIS, (value) => new Wei(value), unit)
        }
        super(value, WEIS);
    }

    static fromEther(value: NumberAmount): Wei {
        return new Wei(value, "ETHER");
    }

    static is(value: any): value is Wei {
        return BigAmount.is(value) && WEIS.equals(value.units);
    }

    static decode(value: string): Wei {
        return new Wei(value);
    }

    protected copyWith(value: BigNumber): this {
        // @ts-ignore
        return new Wei(value);
    }
}

export class WeiEtc extends WeiAny {
    public static ZERO: WeiEtc = new WeiEtc(0);

    constructor(value: NumberAmount | BigAmount, unit?: string | Unit) {
        if (typeof unit !== "undefined") {
            if (BigAmount.is(value)) {
                throw new Error("Already BigAmount");
            }
            return BigAmount.createFor(value, WEIS_ETC, (value) => new WeiEtc(value), unit)
        }
        super(value, WEIS_ETC);
    }

    static is(value: any): value is WeiEtc {
        return BigAmount.is(value) && WEIS_ETC.equals(value.units);
    }

    static decode(value: string): WeiEtc {
        return new WeiEtc(value);
    }

    static fromEther(value: NumberAmount): WeiEtc {
        return new WeiEtc(value, "ETHER");
    }

    protected copyWith(value: BigNumber): this {
        // @ts-ignore
        return new Wei(value);
    }

}