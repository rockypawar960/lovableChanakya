import React, { useState, useEffect } from 'react'
import { userService } from '../../services/userService'
import { BookOpen, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Loading } from '../../components/ui/Loading'
import { useLocation } from 'react-router-dom'

const LearningPaths: React.FC = () => {
  const [paths, setPaths] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [progressMap, setProgressMap] = useState<{ [key: number]: number }>({})

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const careerId = queryParams.get("careerId") || localStorage.getItem("careerId")

  useEffect(() => {
    if (!careerId) {
      setError("Career not found. Please complete assessment or select a career.")
      setLoading(false)
      return
    }
    fetchPaths(Number(careerId))
  }, [careerId])

  const fetchPaths = async (id: number) => {
    try {
      const data = await userService.getLearningPathByCareerId(id)
      setPaths([data])
      fetchProgress(data.id)
    } catch (err) {
      setError('Failed to fetch learning paths')
    } finally {
      setLoading(false)
    }
  }

  const fetchProgress = async (pathId: number) => {
    try {
      const progress = await userService.getProgressByPathId(pathId)
      setProgressMap((prev) => ({ ...prev, [pathId]: Number(progress) || 0 }))
    } catch (err) {
      console.error(err)
    }
  }

  // 🔥 Path shuru karne ke liye (First Step update)
  const handleStart = async (path: any) => {
    const firstStep = path.steps?.[0];
    if (!firstStep) return;
    try {
      await userService.updateStepStatus(firstStep.id, "in_progress");
      setProgressMap(prev => ({ ...prev, [path.id]: 1 })); 
      fetchProgress(path.id);
    } catch (err) {
      console.error("Error starting path:", err);
    }
  };

  // 🔥 Individual Step Complete karne ke liye
  const handleStepComplete = async (pathId: number, stepId: number) => {
  try {
    // 1. Backend update karo status "completed" ke saath
    await userService.updateStepStatus(stepId, "completed");

    // 2. UI Refresh: local state update karo taaki turant tick dikhe
    const updatedPaths = paths.map(p => {
      if (p.id === pathId) {
        return {
          ...p,
          steps: p.steps.map((s: any) => 
            s.id === stepId ? { ...s, status: "completed" } : s
          )
        };
      }
      return p;
    });
    setPaths(updatedPaths);

    // 3. Percentage refresh karo
    fetchProgress(pathId);

  } catch (err) {
    console.error("Failed to complete step:", err);
  }
};
  if (loading) return <Loading message="Loading learning paths..." />

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Learning Paths</h1>
      <p className="text-slate-600 mb-8">Tailored courses for your career goals</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid md:grid-cols-1 gap-8">
        {paths.map((path) => {
          const progress = Number(progressMap[path.id]) || 0;

          return (
            <div key={path.id} className="bg-white border p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800">{path.pathName}</h2>
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock size={18} />
                  <span>{path.durationMonths} months</span>
                </div>
              </div>
              
              <p className="text-slate-600 mb-6">{path.description}</p>

              {/* STEPS LIST */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-lg text-slate-700">Curriculum Steps:</h3>
                {path.steps?.map((step: any) => {
                  const isDone = step.status === "completed";
                  return (
                    <div key={step.id} className={`p-4 border rounded-lg transition-all ${isDone ? 'bg-green-50 border-green-200' : 'bg-slate-50'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          {isDone && <CheckCircle2 className="text-green-600" size={20} />}
                          <div>
                            <h4 className={`font-bold ${isDone ? 'text-green-800 line-through' : 'text-slate-800'}`}>
                              {step.stepName}
                            </h4>
                            <p className="text-sm text-slate-500">{step.description}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleStepComplete(path.id, step.id)}
                          disabled={isDone}
                          className={`text-xs px-3 py-1 rounded-full border transition-colors ${isDone ? 'bg-green-600 text-white border-green-600' : 'border-slate-300 hover:bg-slate-200 text-slate-600'}`}
                        >
                          {isDone ? "Completed" : "Mark Done"}
                        </button>
                      </div>
                      <div className="mt-3 flex gap-4 text-xs">
                        <a href={step.videoLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Video Tutorial</a>
                        <span className="text-slate-400">Task: {step.task}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PROGRESS SECTION */}
              <div className="bg-slate-50 p-4 rounded-lg border">
                <div className="flex justify-between mb-2 items-end">
                  <span className="text-sm font-medium text-slate-700">Course Progress</span>
                  <span className="text-sm font-bold text-green-600">{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 h-full transition-all duration-500" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
                <button
                  onClick={() => handleStart(path)}
                  className={`mt-4 w-full py-2 rounded-lg font-semibold transition-all ${
                    progress >= 100 ? 'bg-green-100 text-green-700 cursor-default' : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {progress >= 100 ? "Congratulations! Path Completed" : progress > 0 ? "Continue Learning" : "Start Learning Path"}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LearningPaths