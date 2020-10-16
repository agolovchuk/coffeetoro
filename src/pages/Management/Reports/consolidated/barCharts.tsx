import * as React from "react";
import { Chart } from "chart.js";
import { orderSum } from "domain/reports/helpers";
import { OrderArchiveItem } from 'domain/reports'

interface Props {
  data: Record<string, ReadonlyArray<OrderArchiveItem>>;
}

function sort(a: string, b: string) {
  return new Date(a).getTime() - new Date(b).getTime();
}

export function BarCharts({ data }: Props) {

  const canvas = React.useRef<HTMLCanvasElement | null>(null);

  const chartRef = React.useRef<Chart | null>(null);

  const datasets = React.useMemo(() => {
    return Object
      .entries(data)
      .sort((a, b) => sort(a[0], b[0]))
      .map(([_, e]) => e.reduce((a, v) => a + (orderSum(v) / 1000), 0));
  }, [data]);

  React.useEffect(() => {
    if (canvas && canvas.current) {
      const ctx = canvas.current.getContext('2d');
      if (ctx) {
        chartRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: Object.keys(data),
            datasets: [{
              data: datasets,
              backgroundColor: '#3796f6',
            }]
          },
        });
      }
    }
  }, []); // eslint-disable-line

  React.useEffect(() => {
    if (chartRef && chartRef.current instanceof Chart) {
      chartRef.current.data.labels = Object.keys(data).sort(sort);
      chartRef.current.data.datasets?.forEach(d => {
        d.data = datasets;
      })
      chartRef.current.update();
    }
  }, [data, datasets]);

  return (
    <canvas width="400" height="100" ref={canvas} />
  );
}
