import React, { ChangeEvent, FormEvent, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, LabelList
} from 'recharts';

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

export default function Example() {
  const [dados, setDados] = useState<IBurnUp[]>()
  const [consultando, setConsultando] = useState(false)
  const [goal, setGoal] = useState(0)
  const [formData, setFormData] = useState<IRequest>({} as IRequest);
  const [inicio, setInicio] = useState<Date>();
  const [fim, setFim] = useState<Date>();


  const handleInicioChange = (day: Date) => {
    setInicio(day)
    setFormData({ ...formData, inicio: day.toISOString() });
  }
  const handleFimChange = (day: Date) => {
    setFim(day)
    setFormData({ ...formData, fim: day.toISOString() });
  }


  const getDados = async (): Promise<IBurnUp[]> => {
    return (await api.get('/', {
      params: formData
    })).data
  }

  const handleConsultar = async (event: FormEvent) => {
    event.preventDefault()
    try {
      setConsultando(true)
      const dados = await getDados()
      setGoal(dados[dados.length - 1].ideal)
      setDados(dados)
    } catch (err) {
      console.log('Erro ao consultar dados. ', err)
    } finally {
      setConsultando(false)
    }
    
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
            inputProps={{required: true}}
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
            inputProps={{required: true}}
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
        <Line type="monotone" dataKey="ideal" name="Expectativa" stroke="red" connectNulls>
          <LabelList dataKey="ideal" position="insideTop" />
        </Line>
        <Line type="monotone" dataKey="total_feito" name="Realizado" stroke="purple" connectNulls>
          <LabelList dataKey="total_feito" position="insideTop" />
        </Line>
        <Line type="monotone" dataKey="dia_feito" name="Executado" stroke="green" connectNulls strokeDasharray="5 3 5">
          <LabelList dataKey="dia_feito" position="insideTop" />
        </Line>
        <Line type="monotone" dataKey="debito" name="Débito" stroke="#555" connectNulls strokeDasharray="5 2 5">
          <LabelList dataKey="debito" position="insideTop" />
        </Line>
        <Line type="monotone" dataKey="burndown" name="BurnDown" stroke="#895" connectNulls strokeDasharray="5 5 4">
          <LabelList dataKey="burndown" position="insideTop" />
        </Line>
      </LineChart>
    </div>
  );
}

