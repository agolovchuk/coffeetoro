import { validate } from "lib/contracts";
import * as contracts from "./contracts";

export const transactionValidator = (v: unknown) => validate(contracts.transactionItem, v);
