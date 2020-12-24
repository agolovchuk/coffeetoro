import * as React from "react";
import { Header } from "../../components";

function Receipt() {
  return (
    <section className="scroll-section">
      <Header title={'Trial Balance'} isSticky />
    </section>
  )
}

export default React.memo(Receipt);
