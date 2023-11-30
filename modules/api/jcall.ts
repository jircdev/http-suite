import { ReactiveModel } from '@beyond-js/reactive/model';
import { PendingPromise } from '@beyond-js/kernel/core';
import { Stream } from './stream';
interface headers {
	'Content-Type': string;
}

export /*bundle*/
class JCall extends ReactiveModel<JCall> {
	get actions() {
		return this.#streamer.actions;
	}
	get streamResponse() {
		return this.#streamer.response;
	}

	#bearer;
	bearer(bearer: string | undefined) {
		if (bearer) this.#bearer = bearer;
		return this;
	}
	#streamer: Stream;
	constructor() {
		super();
		this.#streamer = new Stream(this);
	}

	getHeaders = (specs: any, multipart): Headers => {
		let headers: Headers = new Headers();

		const bearer = specs.bearer || this.#bearer;

		if (bearer) {
			headers.append('Authorization', `Bearer ${bearer}`);
		}
		if (specs.bearer) delete specs.bearer;

		const keys: string[] = Object.keys(specs);
		keys.forEach((key: string): void => {
			if (key === 'bearer') return;
			headers.append(key, specs[key]);
		});

		if (multipart) {
			headers.delete('Content-Type');
		}

		return headers;
	};

	#formData: FormData;
	formData = (specs: Record<string, any>): FormData => {
		this.#formData = new FormData();
		const keys: string[] = Object.keys(specs);
		keys.forEach((key: string): void => {
			this.#formData.append(key, specs[key]);
		});
		return this.#formData;
	};

	#processGetParams(params: Record<string, string>): URLSearchParams | string {
		const emptyParams: boolean = Object.entries(params).length === 0 && params.constructor === Object;
		if (emptyParams) return '';
		const parameters: URLSearchParams = new URLSearchParams();
		for (const key in params) {
			if (![NaN, undefined, ''].includes(params[key])) {
				parameters.append(key, params[key]);
			}
		}
		return parameters;
	}

	#processPostParams = (params, multipart): FormData | string => {
		const emptyParams: boolean = Object.entries(params).length === 0 && params.constructor === Object;
		if (emptyParams) return;

		if (multipart) {
			const data = this.formData(params);
			return data;
		}

		return JSON.stringify(params);
	};
	execute = async (
		url: string,
		method: string = 'get',
		params: Record<string, any> = {},
		headersSpecs?: object,
		stream?: boolean,
		data?: FormData
	): Promise<any> => {
		try {
			if (!headersSpecs) {
				headersSpecs = {};
			}
			const multipart = params.multipart;
			let headers = this.getHeaders({ ...headersSpecs, bearer: params.bearer }, multipart);
			delete params.multipart;
			delete params.bearer;

			const specs: RequestInit = { method, headers, mode: 'cors' };

			if (params.bearer) delete params.bearer;

			if (method === 'post') {
				specs.body = this.#processPostParams(params, multipart);
			} else if (method === 'get') {
				const queryString: string = this.#processGetParams(params).toString();
				if (queryString) url += `?${queryString}`;
			}

			if (stream) return this.#streamer.execute(url, specs);

			const response: Response = await fetch(url, specs);
			return response.json();
		} catch (e) {
			console.error('error jcall', e);
		}
	};

	stream = (
		url: string,
		params: object,
		headers: headers = {
			'Content-Type': 'application/json',
		}
	) => this.execute(url, 'post', params, headers, true);

	get = (url: string, params: object, headers: object) => {
		return this.execute(url, 'get', params);
	};
	post = (
		url: string,
		params: object,
		headers: headers = {
			'Content-Type': 'application/json',
		}
	) => this.execute(url, 'post', params, headers);
	delete = (
		url: string,
		params: object,
		headers: headers = {
			'Content-Type': 'application/json',
		}
	) => this.execute(url, 'DELETE', params, headers);
	put = (
		url: string,
		params: object,
		headers: headers = {
			'Content-Type': 'application/json',
		}
	) => this.execute(url, 'PUT', params, headers);
}
