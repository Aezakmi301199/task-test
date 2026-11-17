import { useState } from 'react';
import type { FormEvent, RefObject } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { MAX_TASK_LENGTH } from '../../../entities/task';

type AddTaskFormProps = {
  onAdd: (title: string) => boolean;
  inputRef: RefObject<HTMLInputElement | null>;
};

export function AddTaskForm({ onAdd, inputRef }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [hasError, setHasError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!onAdd(title)) {
      setHasError(true);
    } else {
      setTitle('');
      setHasError(false);
    }
    inputRef.current?.focus();
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { sm: 'flex-start' },
        gap: 1.25,
      }}
    >
      <TextField
        id="task-title"
        inputRef={inputRef}
        label="Новая задача"
        placeholder="Что нужно сделать?"
        autoComplete="off"
        value={title}
        onChange={event => {
          setTitle(event.target.value);
          setHasError(false);
        }}
        fullWidth
        error={hasError}
        helperText={hasError ? 'Введите название задачи.' : undefined}
        slotProps={{
          htmlInput: { maxLength: MAX_TASK_LENGTH },
          formHelperText: { role: 'alert' },
        }}
        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fbfaff' } }}
      />
      <Button
        type="submit"
        variant="contained"
        startIcon={<span aria-hidden="true">+</span>}
        sx={{ minHeight: { xs: 44, sm: 56 }, px: 2.4, flexShrink: 0 }}
      >
        Добавить
      </Button>
    </Box>
  );
}
