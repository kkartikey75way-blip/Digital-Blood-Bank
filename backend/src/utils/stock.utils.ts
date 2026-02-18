import { IBloodStock } from "../models/user.model";

export const LOW_STOCK_THRESHOLD = 5;

export const getLowStockGroups = (
    stock?: IBloodStock
): string[] => {
    if (!stock) return [];

    const lowStock: string[] = [];

    for (const [group, units] of Object.entries(stock)) {
        if (units < LOW_STOCK_THRESHOLD) {
            lowStock.push(group);
        }
    }

    return lowStock;
};
