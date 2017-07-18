"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Init1500351137914 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE IF NOT EXISTS vehicle (
                id serial PRIMARY KEY,
                vin VARCHAR (255) UNIQUE NOT NULL,
                year integer NOT NULL,
                make VARCHAR (255) NOT NULL,
                model VARCHAR (255) NOT NULL,
                created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
            );`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropTable("vehicle");
        });
    }
}
exports.Init1500351137914 = Init1500351137914;
//# sourceMappingURL=1500351137914-Init.js.map