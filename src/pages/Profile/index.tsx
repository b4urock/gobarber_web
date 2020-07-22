import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../context/ToastContext';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg'

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimationContainer } from './styles';

interface signUpFormData
	{
		name: string;
		emai: string;
		password: string;
	}

const SignUp: React.FC = () => {
	const formRef = useRef<FormHandles>(null);
	const { addToast } = useToast();
	const history = useHistory();

	console.log(formRef);

	const handleSubmit = useCallback(async (data: signUpFormData) => {
		try {
			formRef.current?.setErrors({});

			const schema = Yup.object().shape({
				name: Yup.string().required('Digite seu nome'),
				email: Yup.string().required('Digite seu e-mail').email('Digite um e-email válido'),
				password: Yup.string()
				.required('Digite sua senha')
				.min(8, 'A senha deve ter no mínimo 8 caracteres')
				.matches(
					/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
					"A senha deve ter no mínimo 8 caracteres sendo: Um maiúsculo, um minúsculo, um número e um caracter especial"
				),
			});

			await schema.validate(data, {
				abortEarly: false,
			});

			await api.post('/users', data);

			history.push('/');

			addToast({
				type: 'success',
				title: 'Cadastro realizado com sucesso!',
				description: 'Realize o logon para acessar a aplicação.',
			})

		} catch (err) {
			if (err instanceof Yup.ValidationError) {
				const errors = getValidationErrors(err);

				formRef.current?.setErrors(errors);

				return;

			}

			addToast({
				type: 'error',
				title: 'Error no cadastro',
				description: 'Ocorreu um erro ao fazer o cadastro, tente novamente.'
			});
		}
	},[addToast, history]);

	return (
		<Container>
			<Background />

			<Content>
				<AnimationContainer>
					<img src={logoImg} alt="GoBarber" />

					<Form ref={formRef} onSubmit={handleSubmit}>
						<h1>
							Faça seu cadastro
						</h1>

						<Input name="name" icon={FiUser} placeholder="Nome" />
						<Input name="email" icon={FiMail} placeholder="E-mail" />
						<Input
							name="password"
							icon={FiLock}
							type="password"
							placeholder="Senha"
						/>

						<Button type="submit">Cadastrar</Button>

					</Form>

					<Link to="/">
						<FiArrowLeft />
							Voltar para Logon
					</Link>
				</AnimationContainer>
			</Content>

		</Container>
	);
}

export default SignUp;
