
export interface WidgetChartModel{
    chartType:string,
    title:{
        text:string
    },
    legend:{
        position:any
        orientation:any
    },
    categoryAxis:{
        categories:string[],
    },
    series:{
        name:string,
        data:number[],
        type: any,
        color:string
    }[]
}