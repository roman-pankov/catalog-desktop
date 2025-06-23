export namespace main {
	
	export class ProxyRequest {
	    url: string;
	    method: string;
	    headers: Record<string, string>;
	    body: any;
	
	    static createFrom(source: any = {}) {
	        return new ProxyRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.url = source["url"];
	        this.method = source["method"];
	        this.headers = source["headers"];
	        this.body = source["body"];
	    }
	}
	export class ProxyResponse {
	    data: string;
	    statusCode: number;
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new ProxyResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = source["data"];
	        this.statusCode = source["statusCode"];
	        this.error = source["error"];
	    }
	}

}

