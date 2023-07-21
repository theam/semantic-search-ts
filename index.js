"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSemanticSearch = void 0;
const initSemanticSearch = (url) => {
    const client = new HttpClient(url);
    return {
        search: (request) => client.post('/search', request),
        learn: (request) => client.post('/learn', request),
    };
};
exports.initSemanticSearch = initSemanticSearch;
class HttpClient {
    constructor(url) {
        this.url = url;
    }
    post(path, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${this.url}${path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            return yield res.json();
        });
    }
}
exports.default = exports.initSemanticSearch;
