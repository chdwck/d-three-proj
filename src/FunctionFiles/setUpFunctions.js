//Used in ../components/ProgressArc.js

import * as d3 from 'd3';
const height = 500;
const width = 500;
const radius = Math.min(width, height) / 10;
const spacing = 0.9

const setContext = () => {
  return d3.select("#arc").append('svg')
    .attr('height', height)
    .attr('width', width)
    .attr('id', "d3-arc")
    .attr('viewBox', '0 0 ' + Math.min(width, height)+' '+ Math.min(width, height))
    .attr('preserveAspectRatio', 'xMinYMin')
    .append('g')
    .attr('transform', `translate(${height / 2 }, ${width / 2})`);
}

const arc = (innerR, outerR, start) => (
  d3.arc()
    .innerRadius(innerR)
    .outerRadius(outerR)
    .startAngle(-1.57)
    .cornerRadius(3)
);


const getInner = (i) => i * radius;
const getOuter = (i) => (i + spacing)* radius;

const getColor = (i) => {
  let hVal = (Math.round(Math.random() * 360));
  return `hsl(${hVal}, ${62.5 - (i * 12.5)}%, 50%)`;
}

const setCircle = (context, percentIn, color, innerR, outerR, id) => {
  let endAngle = (Math.PI * 2 * percentIn) - 1.57;
    context.append('path')
    .datum({endAngle: -1.57})
    .attr('d', arc(innerR, outerR))
    .attr('id', 'ani' + id)
    .style('fill', color)
    .append('path')
    .datum({endAngle: Math.PI * 2})
    .attr('d', arc(innerR, outerR))
    .attr("id", "path" + id);
    animate(endAngle, innerR, outerR, "#ani"+ id);
    animate(Math.PI * 2, innerR, outerR, "#path"+ id);


}

const animate = (endAngle, innerR, outerR, id) => {
  d3.select(id)
  .transition()
  .duration(2000)
  .call(arcTween, endAngle, arc(innerR, outerR))
}

const arcTween = (transition, newAngle, arc) => {
  transition.attrTween('d', (d) => {
   const interpolate = d3.interpolate(d.endAngle, newAngle);
   const newArc = d;
   return (t) => {
     newArc.endAngle = interpolate(t);
     return arc(newArc);
   };
  });
}

const addText = (context, id, text, innerR, outerR) => {
  return context.append("text")
    .attr("dy", 25)
    .attr("dx", 10)
    .style("startOffset", "25%")
    .style("fill", "white")
    .append("textPath")
    .attr("class", "arc-text")
    .attr("xlink:href","#path" + id)
    .text(text)
}

const numToStr = (num, e) => {
  let rN = Math.round(num);
  return (num < 1)
    ? "%" + Math.round(num * 100)
    : (e === "Booking Lead Time")
    ? rN + " days"
    : rN
  }

const getText = (obj) => {
  let arr = Object.keys(obj);
  arr.push(arr.splice(1, 1)[0]);
   return arr.map(e => {
     return {key: e, value: numToStr(obj[e], e)}
   });
}


export const drawArcs = (percentages, currentTour) => {
  const context = setContext();
  const textObjs = getText(currentTour);
  let i = 1;
  for (let val in percentages) {
    let keyText = textObjs[i - 1].key;
    let num = textObjs[i - 1].value;
    let inner = getInner(i);
    let out = getOuter(i)
    setCircle(context, percentages[val], getColor(i), inner, out, i);
    addText(context, i, `${keyText}: ${num}`, inner, out);
    i++;
  }
}