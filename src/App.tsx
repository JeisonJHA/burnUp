import React, { ChangeEvent, FormEvent, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, LabelList
} from 'recharts';
import { format } from 'date-fns'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { FormGroup } from '@material-ui/core';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import 'react-day-picker/lib/style.css';

import './App.css'

import api from './api';

interface IBurnUp {
  date: string
  fds: boolean
  ideal: number
  total_feito: number
  dia_feito: number
  debito: number
  burndown: number
}

interface IRequest {
  usuario: string
  senha: string
  inicio: string
  fim: string
  url: string
}

const retorno = [
  {
    "date": "2020-09-08T03:00:00.000Z",
    "fds": false,
    "ideal": 10,
    "dia_feito": 0,
    "total_feito": 0,
    "debito": 10,
    "burndown": 87
  },
  {
    "date": "2020-09-09T03:00:00.000Z",
    "fds": false,
    "ideal": 19,
    "dia_feito": 0,
    "total_feito": 0,
    "debito": 14,
    "burndown": 87
  },
  {
    "date": "2020-09-10T03:00:00.000Z",
    "fds": false,
    "ideal": 29,
    "dia_feito": 6,
    "total_feito": 5,
    "debito": 18,
    "burndown": 82
  },
  {
    "date": "2020-09-11T03:00:00.000Z",
    "fds": false,
    "ideal": 39,
    "dia_feito": 5,
    "total_feito": 11,
    "debito": 27,
    "burndown": 76
  },
  {
    "date": "2020-09-12T03:00:00.000Z",
    "fds": true
  },
  {
    "date": "2020-09-13T03:00:00.000Z",
    "fds": true
  },
  {
    "date": "2020-09-14T03:00:00.000Z",
    "fds": false,
    "ideal": 48,
    "dia_feito": 2,
    "total_feito": 12,
    "debito": 32,
    "burndown": 75
  },
  {
    "date": "2020-09-15T03:00:00.000Z",
    "fds": false,
    "ideal": 58,
    "dia_feito": 3,
    "total_feito": 16,
    "debito": 40,
    "burndown": 71
  },
  {
    "date": "2020-09-16T03:00:00.000Z",
    "fds": false,
    "ideal": 68,
    "dia_feito": 13,
    "total_feito": 18,
    "debito": 38,
    "burndown": 69
  },
  {
    "date": "2020-09-17T03:00:00.000Z",
    "fds": false,
    "ideal": 77,
    "dia_feito": 1,
    "total_feito": 30,
    "debito": 39,
    "burndown": 57
  },
  {
    "date": "2020-09-18T03:00:00.000Z",
    "fds": false,
    "ideal": 87,
    "dia_feito": 8,
    "total_feito": 38,
    "debito": 49,
    "burndown": 49
  }
] as IBurnUp[]

export default function Example() {
  const [dados, setDados] = useState<IBurnUp[]>()
  const [consultando, setConsultando] = useState(false)
  const [goal, setGoal] = useState(0)
  const [formData, setFormData] = useState<IRequest>({} as IRequest);
  const [inicio, setInicio] = useState<Date>();
  const [fim, setFim] = useState<Date>();
  const [checkBoxes, setCheckBoxes] = useState({
    date: true,
    ideal: true,
    total_feito: true,
    dia_feito: true,
    debito: true,
    burndown: true
  })


  const handleInicioChange = (day: Date) => {
    setInicio(day)
    setFormData({ ...formData, inicio: day.toISOString() });
  }

  const handleFimChange = (day: Date) => {
    setFim(day)
    setFormData({ ...formData, fim: day.toISOString() });
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckBoxes({ ...checkBoxes, [event.target.name]: event.target.checked });
  };

  const getDados = async (): Promise<IBurnUp[]> => {
    //return retorno;
    return (await api.get('/', {
      params: formData
    })).data
  }

  const handleConsultar = async (event: FormEvent) => {
    event.preventDefault()
    try {
      setConsultando(true)
      let dados = await getDados()
      dados = formatarDados(dados)
      setGoal(dados[dados.length - 1].ideal)
      setDados(dados)
    } catch (err) {
      console.log('Erro ao consultar dados. ', err)
    } finally {
      setConsultando(false)
    }

  }

  const formatarDados = (dados: IBurnUp[]): IBurnUp[] => {
    return dados.map(dado => ({ ...dado, date: format(new Date(dado.date), 'dd/MM/yyyy') }))
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }


  if (consultando && !dados) { return (<div className="container"><h1>Carregando...</h1></div>) }
  if (!consultando && !dados) {
    return (
      <form className="form" onSubmit={handleConsultar}>
        <input
          className="dadosForm"
          type="text"
          name="usuario"
          placeholder="Usuário"
          required
          onChange={handleInputChange} />

        <input
          className="dadosForm"
          type="password"
          name="senha"
          placeholder="Senha"
          required
          onChange={handleInputChange} />

        <div className="date">
          <DayPickerInput
            value={inicio}
            inputProps={{ required: true }}
            placeholder="Data Inicio"
            onDayChange={handleInicioChange}
            dayPickerProps={{
              selectedDays: inicio,
              disabledDays: {
                daysOfWeek: [0, 6],
              },
            }}
          />
        </div>
        <div className="date">
          <DayPickerInput
            value={fim}
            inputProps={{ required: true }}
            placeholder="Data Fim"
            onDayChange={handleFimChange}
            dayPickerProps={{
              selectedDays: fim,
              disabledDays: {
                daysOfWeek: [0, 6],
              },
            }}
          />
        </div>

        <input
          className="dadosForm"
          type="text"
          name="url"
          placeholder="URL"
          required
          onChange={handleInputChange} />
        <button type="submit">Consultar</button>
      </ form>
    )
  }

  return (
    <div className="container">
      <LineChart
        width={800}
        height={600}
        data={dados}
        margin={{
          top: 20, right: 50, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <ReferenceLine y={goal} label="Story Points" stroke="blue" />
        <Line type="monotone" dataKey="ideal" name="Expectativa" stroke="red" connectNulls hide={!checkBoxes.ideal}>
          <LabelList dataKey="ideal" position="insideTop" />
        </Line>
        <Line type="monotone" dataKey="total_feito" name="Realizado" stroke="purple" connectNulls hide={!checkBoxes.total_feito}>
          <LabelList dataKey="total_feito" position="insideTop" />
        </Line>
        <Line type="monotone" dataKey="dia_feito" name="Executado" stroke="green" connectNulls hide={!checkBoxes.dia_feito} strokeDasharray="5 3 5">
          <LabelList dataKey="dia_feito" position="insideTop" />
        </Line>
        <Line type="monotone" dataKey="debito" name="Débito" stroke="gray" connectNulls hide={!checkBoxes.debito} strokeDasharray="5 2 5">
          <LabelList dataKey="debito" position="insideTop" />
        </Line>
        <Line type="monotone" dataKey="burndown" name="BurnDown" stroke="pink" connectNulls hide={!checkBoxes.burndown} strokeDasharray="5 5 4">
          <LabelList dataKey="burndown" position="insideTop" />
        </Line>
      </LineChart>

      <FormGroup style={{ backgroundColor: 'white', height: '600px', justifyContent: 'center' }}>
        <FormControlLabel
          control={<Checkbox checked={checkBoxes.ideal} onChange={handleChange} name="ideal" style={{ color: 'red' }} />}
          label="Expectativa"
        />
        <FormControlLabel
          control={<Checkbox checked={checkBoxes.total_feito} onChange={handleChange} name="total_feito" style={{ color: 'purple' }} />}
          label="Realizado"
        />
        <FormControlLabel
          control={<Checkbox checked={checkBoxes.dia_feito} onChange={handleChange} name="dia_feito" style={{ color: 'green' }} />}
          label="Executado"
        />
        <FormControlLabel
          control={<Checkbox checked={checkBoxes.debito} onChange={handleChange} name="debito" style={{ color: 'gray' }} />}
          label="Débito"
        />
        <FormControlLabel
          control={<Checkbox checked={checkBoxes.burndown} onChange={handleChange} name="burndown" style={{ color: 'pink' }} />}
          label="BurnDown"
        />
      </FormGroup>
    </div>
  );
}

