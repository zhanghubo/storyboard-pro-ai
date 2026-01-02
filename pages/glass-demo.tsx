/**
 * 🪟 玻璃形态设计系统演示页面
 * 展示所有可用的玻璃形态组件和样式
 */

export default function GlassDemo() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* 页面标题 */}
        <div className="glass-card-strong mb-8 animate-fadeIn text-center">
          <h1 className="font-heading text-6xl mb-4 text-gradient">
            🪟 玻璃形态设计系统
          </h1>
          <p className="font-body text-lg opacity-90 mb-2">
            基于 UI/UX Pro Max 的现代化玻璃风格设计
          </p>
          <div className="flex gap-3 justify-center">
            <span className="badge badge-primary">Next.js 14</span>
            <span className="badge badge-success">Tailwind CSS</span>
            <span className="badge badge-warning">Glassmorphism</span>
          </div>
        </div>

        <div className="glass-divider"></div>

        {/* 卡片展示 */}
        <section className="mb-12">
          <h2 className="font-heading text-4xl mb-6 text-glow">🎴 卡片组件</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="glass-card animate-fadeIn">
              <h3 className="font-heading text-2xl mb-3">标准玻璃卡片</h3>
              <p className="font-body opacity-90">
                使用 <code className="bg-white/20 px-2 py-1 rounded">.glass-card</code> 类
              </p>
              <p className="font-body opacity-90 mt-2">
                适用于大多数内容区域，提供清晰的视觉层次。
              </p>
            </div>

            <div className="glass-card-strong animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <h3 className="font-heading text-2xl mb-3">强玻璃卡片</h3>
              <p className="font-body opacity-90">
                使用 <code className="bg-white/20 px-2 py-1 rounded">.glass-card-strong</code> 类
              </p>
              <p className="font-body opacity-90 mt-2">
                更强的模糊效果，适合重要内容区域。
              </p>
            </div>

            <div className="glass-card float-card animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <h3 className="font-heading text-2xl mb-3">悬浮卡片</h3>
              <p className="font-body opacity-90">
                添加 <code className="bg-white/20 px-2 py-1 rounded">.float-card</code> 类
              </p>
              <p className="font-body opacity-90 mt-2">
                微妙的上下浮动动画，增添生动感。
              </p>
            </div>

          </div>
        </section>

        <div className="glass-divider"></div>

        {/* 按钮展示 */}
        <section className="mb-12">
          <h2 className="font-heading text-4xl mb-6 text-glow">🔘 按钮组件</h2>
          <div className="glass-card">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="text-center">
                <button className="btn-primary w-full mb-2">
                  主要按钮
                </button>
                <code className="text-sm opacity-75">.btn-primary</code>
              </div>

              <div className="text-center">
                <button className="btn-cta w-full mb-2">
                  CTA 按钮
                </button>
                <code className="text-sm opacity-75">.btn-cta</code>
              </div>

              <div className="text-center">
                <button className="btn-secondary w-full mb-2">
                  次要按钮
                </button>
                <code className="text-sm opacity-75">.btn-secondary</code>
              </div>

              <div className="text-center">
                <button className="btn-outline w-full mb-2">
                  轮廓按钮
                </button>
                <code className="text-sm opacity-75">.btn-outline</code>
              </div>

            </div>

            <div className="glass-divider"></div>

            <h3 className="font-heading text-xl mb-4">按钮状态演示</h3>
            <div className="flex gap-4 flex-wrap">
              <button className="btn-primary">正常状态</button>
              <button className="btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                禁用状态
              </button>
              <button className="btn-primary glow">发光效果</button>
            </div>
          </div>
        </section>

        <div className="glass-divider"></div>

        {/* 输入框展示 */}
        <section className="mb-12">
          <h2 className="font-heading text-4xl mb-6 text-glow">📝 输入组件</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="glass-card">
              <h3 className="font-heading text-2xl mb-4">文本输入框</h3>
              <input 
                type="text" 
                className="input-field mb-3"
                placeholder="普通文本输入框"
              />
              <input 
                type="email" 
                className="input-field mb-3"
                placeholder="邮箱输入框"
              />
              <input 
                type="password" 
                className="input-field"
                placeholder="密码输入框"
              />
            </div>

            <div className="glass-card">
              <h3 className="font-heading text-2xl mb-4">选择和文本域</h3>
              <select className="input-field mb-3">
                <option>选择选项 1</option>
                <option>选择选项 2</option>
                <option>选择选项 3</option>
              </select>
              <textarea 
                className="textarea-field"
                placeholder="多行文本输入域"
                rows={4}
              ></textarea>
            </div>

          </div>
        </section>

        <div className="glass-divider"></div>

        {/* 网格单元格展示 */}
        <section className="mb-12">
          <h2 className="font-heading text-4xl mb-6 text-glow">📦 网格单元格</h2>
          <div className="glass-card">
            <p className="font-body mb-6 opacity-90">
              悬停查看交互效果，点击选中单元格
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="grid-cell">
                <div className="text-sm font-semibold mb-2 opacity-75">镜头 1</div>
                <h4 className="font-heading text-lg">默认状态</h4>
                <p className="text-sm opacity-75 mt-2">悬停查看效果</p>
              </div>

              <div className="grid-cell selected">
                <div className="text-sm font-semibold mb-2 opacity-75">镜头 2</div>
                <h4 className="font-heading text-lg">选中状态</h4>
                <p className="text-sm opacity-75 mt-2">已选中的单元格</p>
              </div>

              <div className="grid-cell">
                <div className="text-sm font-semibold mb-2 opacity-75">镜头 3</div>
                <h4 className="font-heading text-lg">普通单元格</h4>
                <p className="text-sm opacity-75 mt-2">16:9 比例</p>
              </div>

              <div className="grid-cell">
                <div className="text-sm font-semibold mb-2 opacity-75">镜头 4</div>
                <h4 className="font-heading text-lg">网格样式</h4>
                <p className="text-sm opacity-75 mt-2">玻璃形态</p>
              </div>

            </div>
          </div>
        </section>

        <div className="glass-divider"></div>

        {/* 徽章和标签 */}
        <section className="mb-12">
          <h2 className="font-heading text-4xl mb-6 text-glow">🏷️ 徽章和标签</h2>
          <div className="glass-card">
            <div className="flex gap-3 flex-wrap mb-6">
              <span className="badge">默认徽章</span>
              <span className="badge badge-primary">主要徽章</span>
              <span className="badge badge-success">成功徽章</span>
              <span className="badge badge-warning">警告徽章</span>
            </div>
            <p className="font-body opacity-75">
              使用徽章标记状态、分类或重要信息
            </p>
          </div>
        </section>

        <div className="glass-divider"></div>

        {/* 动画效果 */}
        <section className="mb-12">
          <h2 className="font-heading text-4xl mb-6 text-glow">🎬 动画效果</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="glass-card animate-fadeIn">
              <h3 className="font-heading text-xl mb-3">淡入动画</h3>
              <code className="text-sm">.animate-fadeIn</code>
              <p className="text-sm opacity-75 mt-3">
                从下方淡入的优雅效果
              </p>
            </div>

            <div className="glass-card animate-slideInLeft">
              <h3 className="font-heading text-xl mb-3">左侧滑入</h3>
              <code className="text-sm">.animate-slideInLeft</code>
              <p className="text-sm opacity-75 mt-3">
                从左侧滑动进入的效果
              </p>
            </div>

            <div className="glass-card animate-scaleIn">
              <h3 className="font-heading text-xl mb-3">缩放进入</h3>
              <code className="text-sm">.animate-scaleIn</code>
              <p className="text-sm opacity-75 mt-3">
                从中心缩放的弹性效果
              </p>
            </div>

          </div>
        </section>

        <div className="glass-divider"></div>

        {/* 文本效果 */}
        <section className="mb-12">
          <h2 className="font-heading text-4xl mb-6 text-glow">✨ 文本效果</h2>
          <div className="glass-card-strong text-center">
            <h3 className="font-heading text-5xl mb-6 text-gradient">
              彩虹渐变文字
            </h3>
            <p className="text-2xl mb-4 text-glow">
              发光文字效果
            </p>
            <p className="font-body text-lg opacity-90">
              使用 <code className="bg-white/20 px-2 py-1 rounded">.text-gradient</code> 和 
              <code className="bg-white/20 px-2 py-1 rounded ml-2">.text-glow</code> 类
            </p>
          </div>
        </section>

        <div className="glass-divider"></div>

        {/* 配色方案 */}
        <section className="mb-12">
          <h2 className="font-heading text-4xl mb-6 text-glow">🎨 配色方案</h2>
          <div className="glass-card">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              
              <div className="p-6 rounded-xl" style={{ background: '#2563EB' }}>
                <div className="font-heading text-xl mb-2">Primary</div>
                <code className="text-sm opacity-90">#2563EB</code>
              </div>

              <div className="p-6 rounded-xl" style={{ background: '#3B82F6' }}>
                <div className="font-heading text-xl mb-2">Secondary</div>
                <code className="text-sm opacity-90">#3B82F6</code>
              </div>

              <div className="p-6 rounded-xl" style={{ background: '#F97316' }}>
                <div className="font-heading text-xl mb-2">CTA</div>
                <code className="text-sm opacity-90">#F97316</code>
              </div>

              <div className="p-6 rounded-xl border-2 border-white/30" style={{ background: '#F8FAFC', color: '#1E293B' }}>
                <div className="font-heading text-xl mb-2">Background</div>
                <code className="text-sm opacity-75">#F8FAFC</code>
              </div>

              <div className="p-6 rounded-xl" style={{ background: '#1E293B' }}>
                <div className="font-heading text-xl mb-2">Text</div>
                <code className="text-sm opacity-90">#1E293B</code>
              </div>

              <div className="p-6 rounded-xl border-2 border-white/30" style={{ background: '#E2E8F0', color: '#1E293B' }}>
                <div className="font-heading text-xl mb-2">Border</div>
                <code className="text-sm opacity-75">#E2E8F0</code>
              </div>

            </div>
          </div>
        </section>

        <div className="glass-divider"></div>

        {/* 返回链接 */}
        <div className="text-center glass-card-strong">
          <h3 className="font-heading text-2xl mb-4">查看完整文档</h3>
          <p className="font-body mb-6 opacity-90">
            更多使用说明请查看 <code className="bg-white/20 px-2 py-1 rounded">GLASSMORPHISM_GUIDE.md</code>
          </p>
          <a href="/" className="btn-primary inline-block">
            返回主页
          </a>
        </div>

      </div>
    </div>
  );
}


