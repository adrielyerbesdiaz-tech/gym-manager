
export class pago{
    private readonly pagoId: number;
    private readonly membresiaID: number;
    private readonly monto: number;
    private readonly fechaPago: Date;

    constructor(membresiaID: number, monto: number, pagoId?: number, fechaPago?: Date){
        this.pagoId = pagoId || 0;
        this.membresiaID = membresiaID;
        this.monto = monto;
        this.fechaPago = fechaPago || new Date();
    }

    public getPagoId(): number {
        return this.pagoId;
    }   

    public getMembresiaID(): number {
        return this.membresiaID;
    }

    public getMonto(): number {
        return this.monto;
    }

    public getFechaPago(): Date {
        return this.fechaPago;
    }

}