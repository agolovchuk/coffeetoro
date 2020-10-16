import * as React from "react";
import { Field } from "react-final-form";
import { Condition, InputField, PriceField, SelectField } from "components/Form/field";
import { ArticleSelector, ServiceSelector } from "../../components/selectors";
import { articleUpdateAdapter, serviceUpdateAdapter } from "../helpers";
import { TMCItem } from "domain/dictionary";
import styles from "./form.module.css";

const TYPE = [
  { name: 'product', title: 'Товары' },
  { name: 'service', title: 'Услуги' },
  { name: 'remittance', title: 'Переводы' },
]

const SOURCE = [
  { name: 'cash', title: 'Касса' },
  { name: 'bank', title: 'Банк' },
  { name: 'income', title: 'Сторонние' },
]

interface Props {
  putArticle: (d: TMCItem) => void;
}

function ManagerForm({ putArticle }: Props) {

  return (
    <React.Fragment>
      <Field name="type" render={({ input}) => (
        <SelectField
          list={TYPE}
          id="type"
          title="Тип:"
          {...input}
        />
      )}/>
      <div className={styles.line}>
        <Condition when="type" is="product" >
          <Field name="foreignId" render={({ input}) => (
            <InputField id="foreignId" title="Накладная:" {...input} />
          )}/>
        </Condition>
        <Condition when="type" is="service" >
          <Field name="foreignId" render={({ input}) => (
            <InputField id="foreignId" title="Накладная:" {...input} />
          )}/>
        </Condition>
        <Field name="date" render={({ input}) => (
          <InputField id="date" title="Дата:" type='date' {...input} />
        )}/>
      </div>
      <Condition when="type" is="product" >
        <ArticleSelector updateAdapter={articleUpdateAdapter} onPicItem={putArticle} />
      </Condition>
      <Condition when="type" is="service" >
        <ServiceSelector updateAdapter={serviceUpdateAdapter} />
      </Condition>
      {/*<Condition when="type" is="remittance" >*/}
      {/*  <ServiceSelector updateAdapter={remittanceUpdateAdapter} />*/}
      {/*</Condition>*/}
      <Field name="source" render={({ input}) => (
        <SelectField
          list={SOURCE}
          id="source"
          title="Источник средств:"
          {...input}
        />
      )}/>
      <div className={styles.line}>
        <Condition when="type" is="product" >
          <Field name="quantity" render={({ input}) => (
            <InputField id="quantity" title="Количество:" inputMode="decimal" {...input} />
          )}/>
        </Condition>
        <Field name="valuation" render={({ input}) => (
          <PriceField id="valuation" title="Цена за единицу:" {...input} />
        )}/>
      </div>
      <Field name="about" render={({ input}) => (
        <InputField id="about" title="Описание:" {...input} />
      )}/>
    </React.Fragment>
  )
}

export default ManagerForm;
