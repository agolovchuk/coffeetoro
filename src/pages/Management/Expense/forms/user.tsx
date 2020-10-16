import * as React from "react";
import { Field } from "react-final-form";
import { TMCItem } from "domain/dictionary";
import { InputField, PriceField } from "components/Form/field";
import { ArticleSelector } from "../../components/selectors";
import { articleUpdateAdapter } from "../helpers";

interface Props {
  putArticle: (d: TMCItem) => void;
}

function UserForm({ putArticle }: Props) {

  return (
    <React.Fragment>
      <ArticleSelector updateAdapter={articleUpdateAdapter} onPicItem={putArticle} />
      <Field name="quantity" render={({ input}) => (
        <InputField id="quantity" title="Количество:" inputMode="decimal" {...input} />
      )}/>
      <Field name="valuation" render={({ input}) => (
        <PriceField id="valuation" title="Цена за единицу:" {...input} />
      )}/>
      <Field name="about" render={({ input}) => (
        <InputField id="about" title="Описание:" {...input} />
      )}/>
    </React.Fragment>
  );
}

export default UserForm;
