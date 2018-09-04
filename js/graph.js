const settingTransactionsPlot = (dataToPlot) => {
    const dataArr = dataToPlot[0].map((elem, index) => {
        if (dataToPlot[0][index] != 0) {
            return {
                label: dataToPlot[1][index],
                value: dataToPlot[0][index],
            };
        }
    });



    for(let i = 0; i < dataArr.length; i++){
        if (dataArr[i] === undefined) {
            dataArr.splice(i, 1);
            i--;
        }
    }

    d3.select("#pie svg").remove();

    const width = 320,
        height = 620,
        radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal(['#BC80BD', '#FB8072', '#FFFFB3', '#B3DE69', '#80B1D3', '#FDB462', '#FCCDE5', '#BEBADA', '#FFED6F', '#8DD3C7', '#D9D9D9', '#CCEBC5']);

    let svg = d3
        .select("#pie")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + 200 + ")");

    const arc = d3.arc()
        .innerRadius(85)
        .outerRadius(radius - 10)
        .padAngle(.05);

    const pie = d3.pie()
        .value((d) => {
            return d.value
        })
        .sort(null);

    const tooltip = d3.select('#pie')
        .append('div')
        .attr('class', 'tooltip');


    tooltip.append('div')
        .attr('class', 'label');

    tooltip.append('div')
        .attr('class', 'count');

    tooltip.append('div')
        .attr('class', 'percent');

    let path = svg.selectAll('path')
        .data(pie(dataArr))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => {
            return color(d.data.label)
        });

    path.on('mouseover', (d) => {
        const total = d3.sum(dataArr.map((d) => {
            return (d.enabled) ? d.value : 0;
        }));
        const percent = Math.round(1000 * d.data.value / total) / 10;
        tooltip.select('.label').html(d.data.label);
        tooltip.select('.count').html(d.data.count);
        tooltip.select('.percent').html(percent + '%');
        tooltip.style('opacity', '1');
    });

    path.on('mouseout', (d) => {
        tooltip.style('opacity', '0');
    })

    const legendRectSize = 18;
    const legendSpacing = 4;

    const legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => {
            const height = legendRectSize + legendSpacing;
            const offset = height * color.domain().length / 2;
            const horz = -2 * legendRectSize;
            const vert = i * height - offset;
            return `translate(${-140}, ${vert + 300})`
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color)
        .on('click', function (label) {


            path = path.data(pie(dataArr));

            path.transition()
                .duration(750)
                .attrTween('d', (d) => {
                    const interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return (t) => {
                        return arc(interpolate(t));
                    };
                });
        });

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (d) { return d.toUpperCase(); });
}