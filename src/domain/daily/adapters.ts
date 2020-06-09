import {validate} from "lib/contracts";
import * as contracts from "./contracts";

export const dayParamsValidator = (v: unknown) => validate(contracts.dayItem, v);
