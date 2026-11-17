import { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Alert, Box, Checkbox, Chip, FormControlLabel, IconButton,
  LinearProgress, List, ListItem, Paper, Stack, Typography,
} from '@mui/material';
import { taskStore } from '../../../entities/task';
import type { Task } from '../../../entities/task';
import { AddTaskForm } from '../../../features/add-task';

type TaskRowProps = {
  task: Task;
  onRemove: (id: Task['id']) => void;
  onSetDone: (id: Task['id'], done: boolean) => void;
  divider: boolean;
};

const TaskRow = observer(function TaskRow({ task, onRemove, onSetDone, divider }: TaskRowProps) {
  return (
    <ListItem
      disableGutters
      divider={divider}
      sx={{ minHeight: 58, gap: 1, py: 0.5, px: 0.75 }}
    >
      <FormControlLabel
        sx={{
          flex: 1,
          minWidth: 0,
          m: 0,
          '& .MuiFormControlLabel-label': { overflowWrap: 'anywhere' },
          ...(task.done && {
            color: 'text.secondary',
            textDecoration: 'line-through',
          }),
        }}
        control={<Checkbox checked={task.done} onChange={(_, checked) => onSetDone(task.id, checked)} />}
        label={task.title}
      />
      <IconButton
        aria-label={`Удалить задачу «${task.title}»`}
        onClick={() => onRemove(task.id)}
        sx={{ width: 44, height: 44, flexShrink: 0, '&:hover': { color: 'error.main', bgcolor: '#fff0f2' } }}
      >
        <span aria-hidden="true">×</span>
      </IconButton>
    </ListItem>
  );
});

export const TasksPage = observer(function TasksPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { tasks, completedCount, storageError } = taskStore;

  return (
    <Box
      component="main"
      sx={{ maxWidth: 704, mx: 'auto', px: { xs: 2, sm: 3 }, pt: { xs: 5, sm: 10 }, pb: 5 }}
    >
      <Box component="header" sx={{ mb: 3.5 }}>
        <Box
          aria-hidden="true"
          sx={{
            display: 'grid', placeItems: 'center', width: 52, height: 52, borderRadius: '17px',
            bgcolor: 'primary.main', color: 'white', fontSize: 28, fontWeight: 700,
            boxShadow: '0 6px 18px #5e3fc745',
          }}
        >
          ✓
        </Box>
        <Typography variant="h1" sx={{ mt: 2, mb: 1, fontSize: 'clamp(2.25rem, 7vw, 3.45rem)' }}>
          Список задач
        </Typography>
        <Typography color="text.secondary">Добавляйте дела и отмечайте выполненное.</Typography>
      </Box>

      <Paper
        component="section"
        aria-labelledby="tasks-heading"
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3.5 }, border: '1px solid', borderColor: 'divider',
          borderRadius: 6, boxShadow: '0 14px 42px #2f1e6610',
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          useFlexGap
          sx={{ flexWrap: 'wrap', gap: 1, mb: 2.5 }}
        >
          <Typography id="tasks-heading" variant="h2">Мои задачи</Typography>
          <Box role="status">
            <Chip
              size="small"
              label={`Выполнено: ${completedCount} из ${tasks.length}`}
              sx={{ bgcolor: '#efe9ff', color: '#503594', fontWeight: 700, px: 0.35 }}
            />
          </Box>
        </Stack>

        <AddTaskForm onAdd={title => taskStore.add(title)} inputRef={inputRef} />
        {storageError && <Alert severity="error" sx={{ mt: 2 }}>{storageError}</Alert>}

        {tasks.length ? (
          <>
            <LinearProgress
              aria-label="Доля выполненных задач"
              variant="determinate"
              value={completedCount / tasks.length * 100}
              sx={{ mt: 2.25, mb: 0.75, height: 5, borderRadius: 3 }}
            />
            <List aria-label="Задачи" disablePadding>
              {tasks.map((task, index) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  divider={index < tasks.length - 1}
                  onSetDone={(id, done) => taskStore.setDone(id, done)}
                  onRemove={id => {
                    taskStore.remove(id);
                    inputRef.current?.focus();
                  }}
                />
              ))}
            </List>
          </>
        ) : (
          <Stack
            alignItems="center"
            sx={{
              mt: 2, px: 1, py: 3, border: '1px dashed #d9cfea',
              borderRadius: 3, textAlign: 'center', bgcolor: '#fdfcff',
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                display: 'grid', placeItems: 'center', width: 42, height: 42,
                borderRadius: 2.5, bgcolor: '#efe9ff', color: 'primary.main', fontSize: 24,
              }}
            >
              ☷
            </Box>
            <Typography sx={{ fontWeight: 700, mt: 1, mb: 0.25 }}>Пока нет задач</Typography>
            <Typography variant="body2" color="text.secondary">Добавьте первое дело в список.</Typography>
          </Stack>
        )}
      </Paper>
      <Typography color="text.secondary" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
        Задачи сохраняются в этом браузере.
      </Typography>
    </Box>
  );
});
