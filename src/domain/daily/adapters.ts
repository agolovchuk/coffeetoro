import {validate} from "lib/contracts";
import * as contracts from "./contracts";

export const dayParamsAdapter = (v: unknown) => validate(contracts.dayItem, v);
