export function economics({revenue, spend, margin, fee, operations}) {
  const values=[revenue,spend,margin,fee,operations];
  if(values.some(v=>!Number.isFinite(v)||v<0)||margin>100) return null;
  const cost=spend+fee+operations, contribution=revenue*margin/100, balance=contribution-cost;
  return {contribution,balance,roas:spend>0?revenue/spend:null,roi:cost>0?balance/cost:null,breakEven:margin>0?cost/(margin/100):null};
}
export function funnel({revenue,ticket,conversion,cpl,days,minutes}) {
  if([revenue,ticket,conversion,cpl,days,minutes].some(v=>!Number.isFinite(v)||v<0)||ticket<=0||conversion<=0||conversion>100||days<=0)return null;
  const orders=Math.ceil(revenue/ticket),leads=Math.ceil(orders/(conversion/100));
  return {orders,leads,budget:leads*cpl,perDay:leads/days,hoursPerDay:leads*minutes/days/60};
}
