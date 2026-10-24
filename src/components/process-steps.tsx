type Step = {title:string; body:string};

export function ProcessSteps({steps}:{steps:Step[]}) {
  return <ol className="process-steps">{steps.map((step,index) =>
    <li key={step.title}>
      <span className="process-step-number">0{index+1}</span>
      <h3>{step.title}</h3>
      <p>{step.body}</p>
    </li>
  )}</ol>;
}
