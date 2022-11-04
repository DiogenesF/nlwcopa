
import Image from 'next/image'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExample from '../assets/users-avatar-example.png'
import iconCheck from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'


interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  const createPool = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const res = await api.post('/pools', {
        title: poolTitle
      })

      const { code } = res.data

      await navigator.clipboard.writeText(code)

      alert('Bolao criado com sucesso, o codigo foi copiado para a area de transferencia')
      
      setPoolTitle('')
    } catch (error) {
      console.log(error)
      alert('Falha ao criar o bolao, tente novamente')
    }

  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image src={logoImg} alt='NLW Copa'/>
        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>Crie seu proprio bolao da copa e compartilhe entre amigos!</h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExample} alt='' />

          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input
            className='flex-1 text-sm px-6 py-4 rounded text-gray-100 bg-gray-800 border border-gray-600'
            type='text' 
            required
            onChange={e => setPoolTitle(e.target.value)}
            value={poolTitle}
            placeholder='Qual nome do seu bolao ?' />
          <button
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
            type='submit'
          >
            Criar meu bolao
          </button>
        </form>

        <p className='mt-4 text-sm leading-relaxed text-gray-300'>Após criar seu bolao, voce receberá um codigo unico que poderá usar para convidar outros participantes 🚀</p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt='' />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600' />

          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt='' />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image 
        src={appPreviewImg}
        quality={100}
        alt='Dois celulares exibindo uma previa da aplicação mobile do NLW Copa' />
    </div>
  )
}

export const getStaticProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }
}