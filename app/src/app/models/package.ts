export class Package {
    _id: string;
    package_id: string;
    package_title: string;
    package_weight: number;
    package_destination: string;
    description: string;
    createdAt: Date;
    isAllocated: boolean;
    driver_id: string;
    constructor() {
        this._id = ''
        this.package_id = '';
        this.package_title = '';
        this.package_weight = 0;
        this.package_destination = '';
        this.description = '';
        this.createdAt = new Date();
        this.isAllocated = false;
        this.driver_id = '';
    }
}