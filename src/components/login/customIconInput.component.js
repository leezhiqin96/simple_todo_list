import React from "react";
import { InputGroup, Input } from "rsuite";

export default function CustomIconInput({ icon, ...props }) {
  return (
    <InputGroup>
      <InputGroup.Addon>
        {icon}
      </InputGroup.Addon>
      <Input {...props} />
    </InputGroup>
  )
}
