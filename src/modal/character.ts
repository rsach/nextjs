export interface Character {
    id: string,
    name: string
    image: string
  }

  export interface Info {
    count: number
    pages: number
  }


  export interface QueryResponse {
      info: Info
      results: Character[]   
    
  
   
  }