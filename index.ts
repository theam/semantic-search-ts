// implement this openapi in typescript:
// {"openapi":"3.0.2","info":{"title":"FastAPI","version":"0.1.0"},
// "paths":{"/search":{"post":{"summary":"Search","operationId":"search_search_post","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/SearchRequest"}}},"required":true},"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"title":"Response Search Search Post","type":"array","items":{"$ref":"#/components/schemas/SearchResult"}}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/learn":{"post":{"summary":"Learn","operationId":"learn_learn_post","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/LearnRequest"}}},"required":true},"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/Response"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}}},"components":{"schemas":{"HTTPValidationError":{"title":"HTTPValidationError","type":"object","properties":{"detail":{"title":"Detail","type":"array","items":{"$ref":"#/components/schemas/ValidationError"}}}},"InstructionTextContent":{"title":"InstructionTextContent","required":["text","instruction"],"type":"object","properties":{"text":{"title":"Text","type":"string"},"instruction":{"title":"Instruction","type":"string"}}},"LearnRequest":{"title":"LearnRequest","required":["items"],"type":"object","properties":{"items":{"title":"Items","type":"array","items":{"$ref":"#/components/schemas/RequestItem"}}}},"RequestItem":{"title":"RequestItem","required":["content","metadata"],"type":"object","properties":{"content":{"title":"Content","anyOf":[{"$ref":"#/components/schemas/TextContent"},{"$ref":"#/components/schemas/InstructionTextContent"}]},"metadata":{"title":"Metadata","type":"object"},"cluster_id":{"title":"Cluster Id","type":"string"}}},"Response":{"title":"Response","required":["ids"],"type":"object","properties":{"ids":{"title":"Ids","type":"array","items":{"type":"string"}}}},"SearchRequest":{"title":"SearchRequest","required":["query","cluster_ids","limit"],"type":"object","properties":{"query":{"title":"Query","anyOf":[{"$ref":"#/components/schemas/TextContent"},{"$ref":"#/components/schemas/InstructionTextContent"}]},"cluster_ids":{"title":"Cluster Ids","type":"array","items":{"type":"string"}},"limit":{"title":"Limit","type":"integer"}}},"SearchResult":{"title":"SearchResult","required":["id","metadata","score"],"type":"object","properties":{"id":{"title":"Id","type":"string"},"metadata":{"title":"Metadata","type":"object"},"score":{"title":"Score","type":"number"},"cluster_id":{"title":"Cluster Id","type":"string"}}},"TextContent":{"title":"TextContent","required":["text"],"type":"object","properties":{"text":{"title":"Text","type":"string"}}},"ValidationError":{"title":"ValidationError","required":["loc","msg","type"],"type":"object","properties":{"loc":{"title":"Location","type":"array","items":{"anyOf":[{"type":"string"},{"type":"integer"}]}},"msg":{"title":"Message","type":"string"},"type":{"title":"Error Type","type":"string"}}}}}}
export interface SearchRequest {
  query: TextContent | InstructionTextContent
  cluster_ids: string[]
  limit: number
}
export interface SearchResult {
  id: string
  metadata: Record<string, unknown>
  score: number
  cluster_id: string
}
export interface TextContent {
  text: string
}
export interface InstructionTextContent {
  text: string
  instruction: string
}
export interface LearnRequest {
  items: RequestItem[]
}
export interface RequestItem {
  content: TextContent | InstructionTextContent
  metadata: Record<string, unknown>
  cluster_id: string
}
export interface Response {
  ids: string[]
}
export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}
export interface HTTPValidationError {
  detail: ValidationError[]
}

export interface SemanticSearch {
  search(request: SearchRequest): Promise<SearchResult[]>
  learn(request: LearnRequest): Promise<Response>
}

export const initSemanticSearch = (url: string): SemanticSearch => {
  const client = new HttpClient(url)
  return {
    search: (request: SearchRequest) => client.post('/search', request) as Promise<SearchResult[]>,
    learn: (request: LearnRequest) => client.post('/learn', request) as Promise<Response>,
  }
}
class HttpClient {
  constructor(private url: string) {}
  async post(path: string, body: unknown): Promise<SearchResult[] | Response | HTTPValidationError> {
    const res = await fetch(`${this.url}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    return await res.json()
  }
}

export default initSemanticSearch
