
declare global {  
    interface String {  
        replaceAll(s1:string, s2:string): string;  

        format(...args: any[]): string;
    }  

    interface Date{
        format(geshi:string):string
    }
}  
export {}; 