import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import * as service from '@/services'
import type { CreateUserPayload } from '@/types/api'
import { encrypt } from '@/utils/crypto'

import { Slogan } from './slogan'

export function Login() {
  const form = useForm<CreateUserPayload>()
  const [inputType, setInputType] = useState<'login' | 'register'>('login')
  const [isAnimating, setIsAnimating] = useState(false)
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Canvas 粒子效果
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // 增强的粒子配置
    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
      opacitySpeed: number
      opacityDirection: 1 | -1
    }> = []
    const particleCount = 150

    // 颜色数组
    const colors = [
      'rgba(59, 130, 246, 0.8)', // 蓝色
      'rgba(139, 92, 246, 0.8)', // 紫色
      'rgba(236, 72, 153, 0.8)', // 粉色
      'rgba(16, 185, 129, 0.8)', // 绿色
      'rgba(245, 158, 11, 0.8)', // 橙色
    ]

    // 初始化粒子
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.8 + 0.2,
        opacitySpeed: Math.random() * 0.01 + 0.005,
        opacityDirection: 1,
      })
    }

    // 鼠标移动事件
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 绘制渐变背景
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, 'rgba(14, 165, 233, 0.1)')
      gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.1)')
      gradient.addColorStop(1, 'rgba(236, 72, 153, 0.1)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 绘制粒子间的连接线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - distance / 120)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // 更新和绘制粒子
      particles.forEach(particle => {
        // 鼠标交互
        const dx = particle.x - mouseRef.current.x
        const dy = particle.y - mouseRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const forceDirectionX = dx / distance
        const forceDirectionY = dy / distance
        const maxDistance = 150
        const force = (maxDistance - distance) / maxDistance

        if (distance < maxDistance) {
          particle.x -= forceDirectionX * force * 0.5
          particle.y -= forceDirectionY * force * 0.5
        }

        // 更新粒子位置
        particle.x += particle.speedX
        particle.y += particle.speedY

        // 边界检测
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY
        }

        // 更新透明度
        particle.opacity += particle.opacitySpeed * particle.opacityDirection
        if (particle.opacity > 1) {
          particle.opacityDirection = -1
        }
        if (particle.opacity < 0.2) {
          particle.opacityDirection = 1
        }

        // 绘制粒子
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color.replace('0.8', particle.opacity.toString())
        ctx.fill()

        // 绘制粒子光晕
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = particle.color.replace('0.8', (particle.opacity * 0.2).toString())
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    // 响应窗口大小变化
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleSubmit = async (values: CreateUserPayload) => {
    setIsAnimating(true)
    const { password } = values
    const encryptedPassword = await encrypt(password)
    if (!encryptedPassword) {
      setIsAnimating(false)
      return
    }
    try {
      const res = await service[inputType]({
        ...values,
        password: encryptedPassword,
      })
      if (!res.data) {
        toast.info('请稍后重试')
        setIsAnimating(false)
        return
      }
      if (inputType === 'login') {
        toast.success('登录成功')
        localStorage.setItem('token', res.data.access_token)
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/doc'
        navigate(redirectUrl)
      }
      if (inputType === 'register') {
        toast.success('注册成功，请前往登录')
        setInputType('login')
      }
    } catch {
      toast.error('登录失败，请稍后重试')
    } finally {
      setIsAnimating(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* 背景粒子效果 */}
      <canvas ref={canvasRef} className="absolute inset-0 -z-10" />

      {/* 顶部品牌展示区 - 左上角，融合到背景中 */}
      <div className="absolute top-6 left-6 z-20 flex items-center space-x-3">
        <Slogan />
      </div>

      {/* 中间表单区 - 居中 */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-lg">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{inputType === 'login' ? '欢迎回来' : '创建账户'}</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {inputType === 'login' ? '登录以继续使用 WoQu 文档' : '注册新账户开始使用 WoQu 文档'}
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  rules={{ required: '请输入用户名' }}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">用户名</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="请输入用户名"
                          className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  rules={{ required: '请输入密码' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">密码</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="请输入密码"
                          className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full py-2 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isAnimating}
                >
                  {isAnimating ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {inputType === 'login' ? '登录中...' : '注册中...'}
                    </div>
                  ) : inputType === 'login' ? (
                    '登录'
                  ) : (
                    '注册'
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {inputType === 'login' ? '还没有账户？' : '已有账户？'}
                <Button
                  variant="link"
                  className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-0 h-auto"
                  onClick={() => {
                    form.clearErrors()
                    setInputType(inputType === 'login' ? 'register' : 'login')
                  }}
                >
                  {inputType === 'login' ? '立即注册' : '立即登录'}
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
