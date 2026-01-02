/**
 * 网格编辑器组件
 * 用于可视化显示和编辑分镜网格
 */

import { GridCellInfo } from '../lib/gridConfig'
import { SHOT_TYPE_CHINESE } from '../lib/promptGenerator'

interface GridEditorProps {
  gridCells: GridCellInfo[]
  selectedCell?: number
  onCellSelect?: (cellIndex: number) => void
  generatedImages?: string[]
}

export default function GridEditor({ 
  gridCells, 
  selectedCell, 
  onCellSelect, 
  generatedImages = [] 
}: GridEditorProps) {
  if (gridCells.length === 0) return null

  const { totalRows, totalCols } = gridCells[0]

  // 创建网格矩阵
  const grid: (GridCellInfo | null)[][] = Array.from({ length: totalRows }, () =>
    Array(totalCols).fill(null)
  )

  gridCells.forEach((cell) => {
    grid[cell.row][cell.col] = cell
  })

  return (
    <div className="w-full">
      <div className="grid gap-3" style={{
        gridTemplateColumns: `repeat(${totalCols}, minmax(0, 1fr))`,
      }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (!cell) return null
            
            const isSelected = selectedCell === cell.shotNumber - 1
            const importanceColor = 
              cell.importance === 'high' ? 'border-purple-500' :
              cell.importance === 'medium' ? 'border-blue-500' :
              'border-slate-500'
            
            const cellImage = generatedImages[cell.shotNumber - 1]

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => onCellSelect?.(cell.shotNumber - 1)}
                className={`grid-cell ${isSelected ? 'selected' : ''} ${importanceColor} relative overflow-hidden`}
                style={cellImage ? {
                  backgroundImage: `url(${cellImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                } : {}}
              >
                {/* 半透明遮罩（仅在有图片时显示） */}
                {cellImage && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>
                )}

                {/* 分镜编号 */}
                <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-10">
                  #{cell.shotNumber}
                </div>

                {/* 重要性标记 */}
                {cell.importance === 'high' && (
                  <div className="absolute top-2 right-2 text-yellow-400 text-lg z-10 drop-shadow-lg">
                    ⭐
                  </div>
                )}

                {/* 信息区域 */}
                <div className="absolute bottom-0 left-0 right-0 p-2 z-10">
                  {/* 网格位置 */}
                  <div className="text-center mb-1">
                    <div className={`text-xs mb-1 font-semibold ${cellImage ? 'text-slate-200' : 'text-slate-400'}`}>
                      {cell.gridPosition}
                    </div>
                    <div className={`font-bold text-sm ${cellImage ? 'text-white drop-shadow-md' : 'text-white'}`}>
                      {SHOT_TYPE_CHINESE[cell.shotType]}
                    </div>
                  </div>

                  {/* 叙事角色 */}
                  <div className={`text-xs text-center mb-1 ${cellImage ? 'text-slate-200' : 'text-slate-300'}`}>
                    {cell.role}
                  </div>

                  {/* 时长 */}
                  {cell.duration && (
                    <div className={`text-xs text-center ${cellImage ? 'text-slate-300' : 'text-slate-400'}`}>
                      {cell.duration}秒
                    </div>
                  )}
                </div>

                {/* 幕次（如果有） */}
                {cell.act && (
                  <div className="absolute bottom-2 left-2 bg-slate-700 text-purple-300 text-xs px-2 py-1 rounded z-10">
                    {cell.act}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* 图例 */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-purple-500 rounded"></div>
          <span className="text-slate-300">高重要性</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
          <span className="text-slate-300">中重要性</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-slate-500 rounded"></div>
          <span className="text-slate-300">低重要性</span>
        </div>
      </div>
    </div>
  )
}
