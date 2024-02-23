import { Employees } from "app/modules/employees/shared/employees.model";
import { Customers } from "app/modules/customers/shared/customers.model";
import { Shippers } from "app/modules/shippers/shared/shippers.model";
import { OrdersTaxStatus } from "app/modules/orders-tax-status/shared/orders-tax-status.model";
import { OrdersStatus } from "app/modules/orders-status/shared/orders-status.model";
import { OrderDetails } from "app/modules/order-details/shared/order-details.model";

import { BaseResourceModel } from "app/shared/models/base-resource.model"; 

export class Orders extends BaseResourceModel {
    id?: any;
    employee?: Employees;
    customer?: Customers;
    orderDate?: Date;
    shippedDate?: Date;
    shipper?: Shippers;
    shipName?: string;
    shipAddress?: string;
    shipCity?: string;
    shipStateProvince?: string;
    shipZipPostalCode?: string;
    shipCountryRegion?: string;
    shippingFee?: number;
    taxes?: number;
    paymentType?: string;
    paidDate?: Date;
    notes?: string;
    taxRate?: number;
    taxStatus?: OrdersTaxStatus;
    status?: OrdersStatus;
    orderDetails?: OrderDetails[];

    static fromJson(jsonData: any): Orders{ 
        return Object.assign(new Orders(), jsonData); 
    } 
}

